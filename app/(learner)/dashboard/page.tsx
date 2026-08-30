import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SetupBanner } from "@/components/setup-banner";
import { getDashboardSnapshot } from "@/lib/db/portal";
import { modules } from "@/lib/data/modules";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <AppShell
      description="See your scores, continue learning, and check your messages."
      role={snapshot.role}
      title={`Welcome${snapshot.profileName ? `, ${snapshot.profileName}` : ""}`}
      userEmail={snapshot.userEmail}
      userPhone={snapshot.userPhone}
    >
      <div className="space-y-8">
        {snapshot.warning ? (
          <SetupBanner message={snapshot.warning} title="Information unavailable" />
        ) : null}

        <section className="grid gap-5 md:grid-cols-3">
          <div className="neo-stat rounded-[1.75rem] p-6">
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Modules attempted</p>
            <p className="mt-3 text-4xl font-black text-slate-950">
              {snapshot.totals.attemptedModules}
            </p>
          </div>
          <div className="neo-stat rounded-[1.75rem] p-6">
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Average score</p>
            <p className="mt-3 text-4xl font-black text-slate-950">
              {snapshot.totals.averageScore}%
            </p>
          </div>
          <div className="neo-stat rounded-[1.75rem] p-6">
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Unread messages</p>
            <p className="mt-3 text-4xl font-black text-slate-950">
              {snapshot.totals.unreadMessages}
            </p>
          </div>
        </section>

        {snapshot.recommendation ? (
          <section className="panel-soft overflow-hidden p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">
                  Recommended next
                </p>
                <h2 className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
                  {snapshot.recommendation.moduleTitle}
                </h2>
                <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                  {snapshot.recommendation.reason}
                </p>
                <p className="mt-4 text-sm font-semibold text-slate-500">
                  Based on your progress: {snapshot.recommendation.evidence}
                </p>
              </div>
              <Link
                className="button-primary w-full sm:w-auto"
                href={`/modules/${snapshot.recommendation.moduleSlug}`}
              >
                {snapshot.recommendation.actionLabel}
              </Link>
            </div>
          </section>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-card rounded-[2rem] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-bold text-slate-950">Recent attempts</p>
                <p className="mt-1 text-sm text-slate-500">
                  Your completed quizzes will appear here.
                </p>
              </div>
              <Link className="button-secondary" href="/messages">
                Open inbox
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {snapshot.attempts.length ? (
                snapshot.attempts.map((attempt) => (
                  <div
                    className="soft-well rounded-[1.5rem] px-5 py-4"
                    key={attempt.id}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{attempt.moduleTitle}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(attempt.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-2xl font-black text-blue-700">
                        {attempt.scorePercent.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="soft-well rounded-[1.5rem] px-5 py-8 text-sm text-slate-500">
                  You have not completed a quiz yet.
                </div>
              )}
            </div>
          </div>

          <div className="panel-soft p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-bold text-slate-950">All modules</p>
                <p className="mt-1 text-sm text-slate-500">
                  Choose a module to continue learning.
                </p>
              </div>
              <Link className="button-secondary" href="/modules">
                View catalog
              </Link>
            </div>

            <div className="mt-6 max-h-[34rem] space-y-3 overflow-y-auto pr-1">
              {modules.map((module) => (
                <Link
                  className="soft-well flex items-center justify-between rounded-[1.35rem] px-4 py-3 text-sm transition hover:border-blue-200 hover:bg-blue-50/40"
                  href={`/modules/${module.slug}`}
                  key={module.slug}
                >
                  <span className="font-medium text-slate-800">{module.title}</span>
                  <span className="text-slate-500">{module.questionCount} Qs</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
