import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { QuizRunner } from "@/components/quiz-runner";
import { SetupBanner } from "@/components/setup-banner";
import { getModuleBySlug } from "@/lib/data/modules";
import { draftModuleMessage, isDraftModule } from "@/lib/data/module-status";
import { renderMathText } from "@/lib/math/render";
import { getModulePageSnapshot } from "@/lib/quiz/data";
import type { QuizTableStimulus, RenderedQuizTableStimulus } from "@/lib/quiz/types";

type ModulePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

function renderTableStimulus(stimulus: QuizTableStimulus): RenderedQuizTableStimulus {
  return {
    ...stimulus,
    columns: stimulus.columns.map(renderMathText),
    rows: stimulus.rows.map((row) => row.map(renderMathText))
  };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { slug } = await params;
  const legacyModule = getModuleBySlug(slug);

  if (!legacyModule) {
    notFound();
  }

  const snapshot = await getModulePageSnapshot(slug);
  const quizModule = snapshot.module;
  const isComingSoon = isDraftModule(slug);
  const renderedQuestions =
    quizModule?.questions.map((question) => ({
      ...question,
      renderedPrompt: renderMathText(question.prompt),
      stimulus: question.stimulus
        ? question.stimulus.type === "diagram" || question.stimulus.type === "image"
          ? question.stimulus
          : renderTableStimulus(question.stimulus)
        : null,
      options: question.options.map((option) => ({
        ...option,
        renderedText: renderMathText(option.text)
      }))
    })) ?? [];

  return (
    <AppShell
      description="Review the topic, answer each question, and receive your score when you finish."
      role={snapshot.role}
      title={legacyModule.title}
      userEmail={snapshot.userEmail}
    >
      <div className="space-y-8">
        {snapshot.warning ? (
          <SetupBanner message={snapshot.warning} title="Module setup" />
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="panel-soft p-6">
            <span className="eyebrow">Module {legacyModule.moduleNumber}</span>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
              {legacyModule.title}
            </h2>
            <div className="academic-rule mt-4" />
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              {legacyModule.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="neo-stat rounded-[1.5rem] p-5">
                <p className="text-sm text-slate-500">Difficulty</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {isComingSoon ? "Coming soon" : legacyModule.difficulty}
                </p>
              </div>
              <div className="neo-stat rounded-[1.5rem] p-5">
                <p className="text-sm text-slate-500">Questions</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{legacyModule.questionCount}</p>
              </div>
              <div className="neo-stat rounded-[1.5rem] p-5">
                <p className="text-sm text-slate-500">Estimated time</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {Math.max(10, Math.ceil(legacyModule.questionCount * 1.5))} minutes
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6">
            <p className="text-lg font-bold text-slate-950">Module status</p>
            <div className="academic-rule mt-4" />
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              {isComingSoon ? (
                <>
                  <p>{draftModuleMessage}</p>
                  <p>
                    The resource notes remain available while the quiz is rebuilt with checked
                    diagrams and stronger WASSCE-style items.
                  </p>
                </>
              ) : quizModule?.questions.length ? (
                <>

                  <p>Your score and answer explanations will be shown after you submit the quiz.</p>
                </>
              ) : (
                <>
                  <p>This quiz is not available yet. Please choose another module for now.</p>
                </>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="button-secondary" href="/dashboard">
                Back to dashboard
              </Link>
              <Link className="button-primary" href={isComingSoon ? "/resources" : "/messages"}>
                {isComingSoon ? "Open resources" : "Open message center"}
              </Link>
            </div>
          </div>
        </section>

        {isComingSoon ? (
          <section className="glass-card rounded-[2rem] p-6">
            <p className="text-lg font-bold text-slate-950">Coming soon</p>
            <div className="academic-rule mt-4" />
            <div className="mt-5 max-w-3xl space-y-3 text-sm leading-7 text-slate-600">
              <p>
                This module is paused for quality review. The draft question bank is preserved in
                the repository, but learners will not attempt it until the diagrams, questions,
                answer keys, and explanations have been checked together.
              </p>
              <p>
                Use the matching resource from the Resources page for now.
              </p>
            </div>
          </section>
        ) : quizModule?.questions.length ? (
          <QuizRunner
            moduleSlug={quizModule.slug}
            moduleTitle={quizModule.title}
            questions={renderedQuestions}
          />
        ) : null}
      </div>
    </AppShell>
  );
}
