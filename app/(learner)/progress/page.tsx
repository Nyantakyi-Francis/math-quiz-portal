import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SetupBanner } from "@/components/setup-banner";
import { getProgressSnapshot } from "@/lib/db/portal";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const snapshot = await getProgressSnapshot();

  return (
    <AppShell
      description="Track score history, module coverage, and mastery across Elective Mathematics."
      role={snapshot.role}
      title="Progress Analytics"
      userEmail={snapshot.userEmail}
      userPhone={snapshot.userPhone}
    >
      <div className="space-y-8">
        {snapshot.warning ? (
          <SetupBanner message={snapshot.warning} title="Progress unavailable" />
        ) : null}

        <section className="grid gap-5 md:grid-cols-4">
          <div className="neo-stat rounded-[1.75rem] p-6">
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Attempts</p>
            <p className="mt-3 text-4xl font-black text-slate-950">{snapshot.totals.attempts}</p>
          </div>
          <div className="neo-stat rounded-[1.75rem] p-6">
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Modules tried</p>
            <p className="mt-3 text-4xl font-black text-slate-950">
              {snapshot.totals.modulesAttempted}
            </p>
          </div>
          <div className="neo-stat rounded-[1.75rem] p-6">
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Average</p>
            <p className="mt-3 text-4xl font-black text-slate-950">
              {snapshot.totals.averageScore}%
            </p>
          </div>
          <div className="neo-stat rounded-[1.75rem] p-6">
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Mastered</p>
            <p className="mt-3 text-4xl font-black text-slate-950">
              {snapshot.totals.masteredModules}
            </p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-slate-950">Module performance</p>
                <p className="mt-1 text-sm text-slate-500">
                  Mastery uses the 70% threshold used by recommendations.
                </p>
              </div>
              <Link className="button-secondary" href="/modules">
                Practise module
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {snapshot.modules.length ? (
                snapshot.modules.map((module) => (
                  <article
                    className="rounded-2xl border border-slate-200 p-4 text-sm"
                    key={module.slug}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-950">{module.title}</p>
                        <p className="mt-1 text-slate-500">
                          {module.attempts} attempt{module.attempts === 1 ? "" : "s"} · last tried{" "}
                          {new Date(module.lastAttemptAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="message-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                        {module.mastered ? "Mastered" : "Building"}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-4">
                      <div className="soft-well rounded-xl px-3 py-2">
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Latest</p>
                        <p className="mt-1 text-lg font-black text-slate-950">
                          {module.latestScore.toFixed(1)}%
                        </p>
                      </div>
                      <div className="soft-well rounded-xl px-3 py-2">
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Best</p>
                        <p className="mt-1 text-lg font-black text-slate-950">
                          {module.bestScore.toFixed(1)}%
                        </p>
                      </div>
                      <div className="soft-well rounded-xl px-3 py-2">
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">First</p>
                        <p className="mt-1 text-lg font-black text-slate-950">
                          {module.firstScore.toFixed(1)}%
                        </p>
                      </div>
                      <div className="soft-well rounded-xl px-3 py-2">
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Change</p>
                        <p className="mt-1 text-lg font-black text-slate-950">
                          {module.improvement > 0 ? "+" : ""}
                          {module.improvement.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-sm text-slate-500">
                  Complete a quiz to begin building your progress record.
                </div>
              )}
            </div>
          </div>

          <div className="panel-soft p-6">
            <p className="text-lg font-bold text-slate-950">Recent activity</p>
            <div className="mt-6 space-y-3">
              {snapshot.recentAttempts.length ? (
                snapshot.recentAttempts.map((attempt) => (
                  <div className="soft-well rounded-[1.35rem] px-4 py-3" key={attempt.id}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{attempt.moduleTitle}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(attempt.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-xl font-black text-blue-700">
                        {attempt.scorePercent.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-sm text-slate-500">
                  No attempts have been recorded yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
