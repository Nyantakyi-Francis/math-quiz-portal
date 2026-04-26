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
      description="Protected module route with database-backed quiz delivery and server-side scoring."
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
              {legacyModule.description} This route is now wired for real database-backed quiz
              delivery. Once a module has been imported, attempts are scored on the server and
              written to the learner dashboard and inbox automatically.
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
                <p className="text-sm text-slate-500">Legacy source</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {legacyModule.legacyDataPath}
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
                  <p>This module has been imported into Postgres and is ready for protected use.</p>
                  <p>
                    Answer keys stay on the server. Learners only receive the questions and options
                    needed to attempt the quiz.
                  </p>
                  <p>
                    Submission creates an <span className="font-mono text-[var(--brand-deep)]">attempt</span>, saves <span className="font-mono text-[var(--brand-deep)]">attempt_answers</span>, and writes a score
                    message to the learner inbox.
                  </p>
                </>
              ) : (
                <>
                  <p>This module shell exists, but the question bank has not been imported yet.</p>
                  <p>
                    Run the import script for this module and refresh this page to switch from the
                    placeholder to the live quiz runner.
                  </p>
                  <p>
                    Start with `binary-sets-binomial`, then repeat the same flow for the remaining
                    modules.
                  </p>
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
