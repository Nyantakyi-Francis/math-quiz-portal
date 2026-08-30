import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildScoreMessageBody, buildScoreMessageSubject } from "@/lib/quiz/messages";
import { readJsonBody } from "@/lib/http/validation";
import { notifyMessageRecipientsByEmail } from "@/lib/email/notifications";
import { validateQuizSubmissionBody } from "@/lib/quiz/validation";
import { normalizeQuizExplanation } from "@/lib/quiz/explanations";
import type { QuizSubmissionResult } from "@/lib/quiz/types";

type SubmitRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

type SubmitAttemptRpcRow = {
  attempt_id: string;
  score_raw: number;
  score_total: number;
  score_percent: number | string;
  breakdown: Array<{
    questionId: string;
    isCorrect: boolean;
  }>;
  module_title: string;
};

export async function POST(request: Request, { params }: SubmitRouteContext) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      {
        error: "Supabase is not configured yet."
      },
      { status: 500 }
    );
  }

  if (!admin) {
    return NextResponse.json(
      {
        error: "The service role key is missing, so quiz scoring cannot run yet."
      },
      { status: 500 }
    );
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "You must be logged in to submit a quiz attempt."
      },
      { status: 401 }
    );
  }

  const body = await readJsonBody(request, validateQuizSubmissionBody);

  if (!body.ok) {
    return NextResponse.json(
      {
        error: body.error
      },
      { status: 400 }
    );
  }

  await admin.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      full_name:
        typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : null
    },
    {
      onConflict: "id"
    }
  );

  const { data: attemptResult, error: attemptError } = await admin
    .rpc("submit_quiz_attempt", {
      p_learner_id: user.id,
      p_module_slug: slug,
      p_answers: body.value.answers
    })
    .single();

  if (attemptError || !attemptResult) {
    const message = attemptError?.message ?? "Unable to save this attempt.";
    const status =
      message.includes("MODULE_NOT_FOUND") ? 404 : message.includes("QUESTION_BANK_EMPTY") ? 400 : 500;

    return NextResponse.json(
      {
        error:
          message.includes("MODULE_NOT_FOUND")
            ? "This module was not found in the database."
            : message.includes("QUESTION_BANK_EMPTY")
              ? "This module exists, but its question bank has not been imported yet."
              : message
      },
      { status }
    );
  }

  const scoredAttempt = attemptResult as SubmitAttemptRpcRow;
  const scoreRaw = Number(scoredAttempt.score_raw);
  const scoreTotal = Number(scoredAttempt.score_total);
  const scorePercent = Number(scoredAttempt.score_percent);
  const moduleTitle = scoredAttempt.module_title;
  const questionIds = scoredAttempt.breakdown.map((entry) => entry.questionId);
  const selectedOptionByQuestion = new Map(
    body.value.answers.map((answer) => [answer.questionId, answer.selectedOptionId])
  );

  const [{ data: answerKeys, error: answerKeyError }, { data: explanations, error: explanationError }] =
    await Promise.all([
      admin
        .from("question_answer_keys")
        .select("question_id, correct_option_id")
        .in("question_id", questionIds),
      admin.from("question_explanations").select("question_id, content").in("question_id", questionIds)
    ]);

  if (answerKeyError || explanationError) {
    return NextResponse.json(
      { error: answerKeyError?.message ?? explanationError?.message ?? "Unable to load answer reviews." },
      { status: 500 }
    );
  }

  const answerKeyByQuestion = new Map(
    (answerKeys ?? []).map((answerKey) => [answerKey.question_id, answerKey.correct_option_id])
  );
  const missingAnswerKey = questionIds.find((questionId) => !answerKeyByQuestion.has(questionId));

  if (missingAnswerKey) {
    return NextResponse.json(
      { error: `No answer key was found for question ${missingAnswerKey}.` },
      { status: 500 }
    );
  }
  const optionIds = Array.from(
    new Set([
      ...Array.from(answerKeyByQuestion.values()),
      ...Array.from(selectedOptionByQuestion.values()).filter((id): id is string => Boolean(id))
    ])
  );
  const { data: reviewOptions, error: reviewOptionError } = optionIds.length
    ? await admin.from("question_options").select("id, option_text").in("id", optionIds)
    : { data: [], error: null };

  if (reviewOptionError) {
    return NextResponse.json({ error: reviewOptionError.message }, { status: 500 });
  }

  const optionTextById = new Map(
    (reviewOptions ?? []).map((option) => [option.id, option.option_text])
  );
  const explanationByQuestion = new Map(
    (explanations ?? []).map((explanation) => [explanation.question_id, explanation.content])
  );

  const learnerName =
    typeof user.user_metadata.full_name === "string" && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : "Learner";
  const messageSubject = buildScoreMessageSubject(moduleTitle, scorePercent);
  const messageBody = buildScoreMessageBody({
    learnerName,
    moduleTitle,
    scoreRaw,
    scoreTotal,
    scorePercent
  });

  const { data: messageRow, error: messageError } = await admin
    .from("messages")
    .insert({
      sender_id: null,
      subject: messageSubject,
      body: messageBody,
      message_type: "score"
    })
    .select("id")
    .single();

  if (!messageError && messageRow) {
    await admin.from("message_recipients").insert({
      message_id: messageRow.id,
      recipient_id: user.id
    });

    if (user.email) {
      await notifyMessageRecipientsByEmail({
        request,
        recipients: [{ email: user.email }],
        senderLabel: "System",
        subject: messageSubject,
        body: messageBody,
        linkPath: "/messages"
      });
    }
  }

  const result: QuizSubmissionResult = {
    attemptId: scoredAttempt.attempt_id,
    scoreRaw,
    scoreTotal,
    scorePercent,
    incorrectCount: scoreTotal - scoreRaw,
    messageSubject,
    breakdown: scoredAttempt.breakdown.map((entry) => {
      const selectedOptionId = selectedOptionByQuestion.get(entry.questionId) ?? null;
      const correctOptionId = answerKeyByQuestion.get(entry.questionId);
      const explanation = normalizeQuizExplanation(explanationByQuestion.get(entry.questionId));

      return {
        questionId: entry.questionId,
        isCorrect: entry.isCorrect,
        selectedOptionId,
        selectedOptionText: selectedOptionId ? optionTextById.get(selectedOptionId) ?? null : null,
        correctOptionId: correctOptionId!,
        correctOptionText: optionTextById.get(correctOptionId!) ?? "Correct answer unavailable",
        explanation,
        misconception:
          !entry.isCorrect && selectedOptionId
            ? explanation.misconceptions[selectedOptionId] ?? null
            : null
      };
    })
  };

  return NextResponse.json(result);
}
