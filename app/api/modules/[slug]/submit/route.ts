import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildScoreMessageBody, buildScoreMessageSubject } from "@/lib/quiz/messages";
import type { QuizSubmissionAnswer, QuizSubmissionResult } from "@/lib/quiz/types";

type SubmitRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

type SubmissionBody = {
  answers?: QuizSubmissionAnswer[];
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

  const body = (await request.json()) as SubmissionBody;
  const answers = Array.isArray(body.answers) ? body.answers : [];

  if (!answers.length) {
    return NextResponse.json(
      {
        error: "No quiz answers were submitted."
      },
      { status: 400 }
    );
  }

  const { data: moduleRow, error: moduleError } = await admin
    .from("modules")
    .select("id, slug, title")
    .eq("slug", slug)
    .maybeSingle();

  if (moduleError || !moduleRow) {
    return NextResponse.json(
      {
        error: moduleError?.message ?? "This module was not found in the database."
      },
      { status: 404 }
    );
  }

  const { data: questionRows, error: questionError } = await admin
    .from("questions")
    .select("id")
    .eq("module_id", moduleRow.id)
    .order("order_index", { ascending: true });

  if (questionError || !questionRows?.length) {
    return NextResponse.json(
      {
        error:
          questionError?.message ??
          "This module exists, but its question bank has not been imported yet."
      },
      { status: 400 }
    );
  }

  const questionIds = questionRows.map((question) => question.id);

  const [optionsResponse, answerKeysResponse] = await Promise.all([
    admin
      .from("question_options")
      .select("id, question_id")
      .in("question_id", questionIds),
    admin
      .from("question_answer_keys")
      .select("question_id, correct_option_id")
      .in("question_id", questionIds)
  ]);

  if (optionsResponse.error || answerKeysResponse.error) {
    return NextResponse.json(
      {
        error:
          optionsResponse.error?.message ??
          answerKeysResponse.error?.message ??
          "Unable to score this attempt."
      },
      { status: 500 }
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

  const validOptionIdsByQuestion = new Map<string, Set<string>>();
  const correctOptionByQuestion = new Map<string, string>();

  optionsResponse.data?.forEach((option) => {
    const current = validOptionIdsByQuestion.get(option.question_id) ?? new Set<string>();
    current.add(option.id);
    validOptionIdsByQuestion.set(option.question_id, current);
  });

  answerKeysResponse.data?.forEach((entry) => {
    correctOptionByQuestion.set(entry.question_id, entry.correct_option_id);
  });

  const answerMap = new Map<string, string | null>();

  answers.forEach((answer) => {
    if (questionIds.includes(answer.questionId)) {
      answerMap.set(answer.questionId, answer.selectedOptionId ?? null);
    }
  });

  let scoreRaw = 0;

  const breakdown = questionIds.map((questionId) => {
    const selectedOptionId = answerMap.get(questionId) ?? null;
    const validOptionIds = validOptionIdsByQuestion.get(questionId) ?? new Set<string>();
    const normalizedSelection =
      selectedOptionId && validOptionIds.has(selectedOptionId) ? selectedOptionId : null;
    const isCorrect =
      normalizedSelection !== null &&
      normalizedSelection === correctOptionByQuestion.get(questionId);

    if (isCorrect) {
      scoreRaw += 1;
    }

    return {
      questionId,
      selectedOptionId: normalizedSelection,
      isCorrect
    };
  });

  const scoreTotal = questionIds.length;
  const scorePercent = scoreTotal
    ? Number(((scoreRaw / scoreTotal) * 100).toFixed(1))
    : 0;

  const { data: attemptRow, error: attemptError } = await admin
    .from("attempts")
    .insert({
      learner_id: user.id,
      module_id: moduleRow.id,
      score_raw: scoreRaw,
      score_total: scoreTotal,
      score_percent: scorePercent,
      completed_at: new Date().toISOString()
    })
    .select("id")
    .single();

  if (attemptError || !attemptRow) {
    return NextResponse.json(
      {
        error: attemptError?.message ?? "Unable to save this attempt."
      },
      { status: 500 }
    );
  }

  const attemptAnswerRows = breakdown.map((entry) => ({
    attempt_id: attemptRow.id,
    question_id: entry.questionId,
    selected_option_id: entry.selectedOptionId,
    is_correct: entry.isCorrect
  }));

  const { error: attemptAnswersError } = await admin.from("attempt_answers").insert(attemptAnswerRows);

  if (attemptAnswersError) {
    return NextResponse.json(
      {
        error: attemptAnswersError.message
      },
      { status: 500 }
    );
  }

  const learnerName =
    typeof user.user_metadata.full_name === "string" && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : "Learner";
  const messageSubject = buildScoreMessageSubject(moduleRow.title, scorePercent);
  const messageBody = buildScoreMessageBody({
    learnerName,
    moduleTitle: moduleRow.title,
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
  }

  const result: QuizSubmissionResult = {
    attemptId: attemptRow.id,
    scoreRaw,
    scoreTotal,
    scorePercent,
    incorrectCount: scoreTotal - scoreRaw,
    messageSubject,
    breakdown: breakdown.map((entry) => ({
      questionId: entry.questionId,
      isCorrect: entry.isCorrect
    }))
  };

  return NextResponse.json(result);
}
