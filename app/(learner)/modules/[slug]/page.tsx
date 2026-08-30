import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { QuizRunner } from "@/components/quiz-runner";
import { SetupBanner } from "@/components/setup-banner";
import { getModuleBySlug } from "@/lib/data/modules";
import { getModulePageSnapshot } from "@/lib/quiz/data";

type ModulePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ModulePage({ params }: ModulePageProps) {
  const { slug } = await params;
  const legacyModule = getModuleBySlug(slug);

  if (!legacyModule) {
    notFound();
  }

  const snapshot = await getModulePageSnapshot(slug);
  const quizModule = snapshot.module;

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
                <p className="mt-2 text-lg font-bold text-slate-900">{legacyModule.difficulty}</p>
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
              {quizModule?.questions.length ? (
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
              <Link className="button-primary" href="/messages">
                Open message center
              </Link>
            </div>
          </div>
        </section>

        {quizModule?.questions.length ? (
          <QuizRunner
            moduleSlug={quizModule.slug}
            moduleTitle={quizModule.title}
            questions={quizModule.questions}
          />
        ) : null}
      </div>
    </AppShell>
  );
}
