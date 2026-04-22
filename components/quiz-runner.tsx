"use client";

import { useState } from "react";
import Link from "next/link";
import { MathText } from "@/components/math-text";
import type {
  LearnerQuizQuestion,
  QuizSubmissionAnswer,
  QuizSubmissionResult
} from "@/lib/quiz/types";

type QuizRunnerProps = {
  moduleSlug: string;
  moduleTitle: string;
  questions: LearnerQuizQuestion[];
};

function shuffleOptions(questions: LearnerQuizQuestion[]) {
  return questions.map((question) => {
    const options = [...question.options];

    for (let index = options.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [options[index], options[swapIndex]] = [options[swapIndex], options[index]];
    }

    return {
      ...question,
      options
    };
  });
}

export function QuizRunner({ moduleSlug, moduleTitle, questions }: QuizRunnerProps) {
  const [displayQuestions, setDisplayQuestions] = useState(() => shuffleOptions(questions));
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuizSubmissionResult | null>(null);

  const answeredCount = Object.keys(answers).length;
  const breakdownMap = new Map(result?.breakdown.map((item) => [item.questionId, item.isCorrect]));

  function handleSelect(questionId: string, optionId: string) {
    setAnswers((current) => ({
      ...current,
      [questionId]: optionId
    }));
  }

  function handleReset() {
    setAnswers({});
    setResult(null);
    setError(null);
    setDisplayQuestions(shuffleOptions(questions));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const payload: QuizSubmissionAnswer[] = displayQuestions.map((question) => ({
      questionId: question.id,
      selectedOptionId: answers[question.id] ?? null
    }));

    if (!payload.some((entry) => entry.selectedOptionId)) {
      setError("Select at least one answer before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/modules/${moduleSlug}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          answers: payload
        })
      });

      const data = (await response.json()) as QuizSubmissionResult | { error?: string };

      if (!response.ok) {
        setError(
          "error" in data && data.error ? data.error : "Unable to submit this attempt right now."
        );
        return;
      }

      setResult(data as QuizSubmissionResult);
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="panel-soft p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-slate-950">{moduleTitle}</p>
            <p className="mt-1 text-sm text-slate-500">
              Questions are now coming from Postgres and scores are written back to your protected
              learner record.
            </p>
          </div>
          <div className="soft-well rounded-full px-4 py-2 text-sm font-semibold text-[var(--brand-deep)]">
            {answeredCount}/{displayQuestions.length} answered
          </div>
        </div>

        {result ? (
          <div className="mt-6 rounded-[1.75rem] border border-emerald-200/70 bg-linear-to-br from-emerald-50/90 via-white/85 to-blue-50/65 px-5 py-5 shadow-[18px_18px_40px_-32px_rgba(22,163,74,0.34)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Attempt saved
                </p>
                <p className="mt-2 text-3xl font-black text-emerald-900">
                  {result.scoreRaw}/{result.scoreTotal} ({result.scorePercent.toFixed(1)}%)
                </p>
                <p className="mt-2 text-sm text-emerald-800">
                  {result.messageSubject}. Your dashboard and message center have been updated.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link className="button-secondary" href="/dashboard">
                  View dashboard
                </Link>
                <Link className="button-secondary" href="/messages">
                  Open inbox
                </Link>
                <button className="button-primary" onClick={handleReset} type="button">
                  Retake module
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-[1.75rem] border border-rose-200/70 bg-linear-to-br from-rose-50/90 via-white/85 to-amber-50/55 px-5 py-4 text-sm text-rose-800">
            {error}
          </div>
        ) : null}
      </section>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {displayQuestions.map((question, index) => {
          const questionResult = result ? breakdownMap.get(question.id) : undefined;

          return (
            <section
              className={`glass-card rounded-[2rem] p-6 ${
                questionResult === true
                  ? "border-emerald-200"
                  : questionResult === false
                    ? "border-rose-200"
                    : ""
              }`}
              key={question.id}
            >
              <div className="flex items-start gap-4">
                <div className="logo-mark h-9 w-9 shrink-0 rounded-[0.95rem] text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold leading-7 text-slate-900">
                    <MathText text={question.prompt} />
                  </p>

                  <div className="mt-5 grid gap-3">
                    {question.options.map((option) => {
                      const checked = answers[question.id] === option.id;

                      return (
                        <label
                          className={`cursor-pointer rounded-[1.25rem] px-4 py-4 text-sm transition ${
                            checked
                              ? "soft-well border-blue-300 bg-blue-50/50"
                              : "soft-well hover:border-blue-200 hover:bg-blue-50/35"
                          }`}
                          key={option.id}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              checked={checked}
                              className="mt-1"
                              name={question.id}
                              onChange={() => handleSelect(question.id, option.id)}
                              type="radio"
                              value={option.id}
                            />
                            <span className="leading-7 text-slate-700">
                              <MathText text={option.text} />
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {questionResult === true ? (
                    <p className="mt-4 text-sm font-semibold text-emerald-700">Correct</p>
                  ) : null}
                  {questionResult === false ? (
                    <p className="mt-4 text-sm font-semibold text-rose-700">
                      Incorrect. Review this one before the next attempt.
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
          );
        })}

        <section className="glass-card rounded-[2rem] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-lg font-bold text-slate-950">Submit attempt</p>
              <p className="mt-1 text-sm text-slate-500">
                Submission writes your score to Postgres and sends a score message to your inbox.
              </p>
            </div>

            <button className="button-primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Submitting..." : "Finish and save score"}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
