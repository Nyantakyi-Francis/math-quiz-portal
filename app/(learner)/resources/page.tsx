import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SetupBanner } from "@/components/setup-banner";
import { resources } from "@/lib/data/resources";
import { getDashboardSnapshot } from "@/lib/db/portal";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <AppShell
      description="Shared PDF library for learners and admins."
      role={snapshot.role}
      title="Resource Library"
      userEmail={snapshot.userEmail}
      userPhone={snapshot.userPhone}
    >
      <div className="space-y-8">
        {snapshot.warning ? (
          <SetupBanner message={snapshot.warning} title="Protected data setup" />
        ) : null}

        <section className="panel-soft overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="dark-panel rounded-none px-6 py-8 sm:px-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                PDF Collection
              </p>
              <h2 className="mt-4 max-w-md text-3xl font-black tracking-tight text-white sm:text-4xl">
                Notes ready for focused revision.
              </h2>
              <div className="academic-rule mt-5" />
              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-200">
                Ten topic packs are gathered in one protected place, with clean filenames that are
                easy to share and maintain.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px bg-white/50 sm:grid-cols-4">
              <div className="bg-white/70 px-5 py-6">
                <p className="text-3xl font-black text-slate-950">{resources.length}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  PDFs
                </p>
              </div>
              <div className="bg-white/70 px-5 py-6">
                <p className="text-3xl font-black text-slate-950">10</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Topics
                </p>
              </div>
              <div className="bg-white/70 px-5 py-6">
                <p className="text-3xl font-black text-slate-950">PDF</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Format
                </p>
              </div>
              <div className="bg-white/70 px-5 py-6">
                <p className="text-3xl font-black text-slate-950">24/7</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Access
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource, index) => (
            <article
              className={`glass-card group flex h-full flex-col border ${resource.tone.accent} p-6 transition hover:-translate-y-1`}
              key={resource.slug}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${resource.tone.badge} ${resource.tone.badgeText}`}
                >
                  Resource {index + 1}
                </span>
                <span className="soft-well rounded-full px-3 py-1 text-xs font-semibold text-slate-600">
                  {resource.sizeLabel}
                </span>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-14 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-deep)] text-xs font-black tracking-[0.14em] text-white shadow-[12px_12px_24px_-18px_rgba(22,52,103,0.7)]">
                  PDF
                </div>
                <h3 className="text-xl font-black tracking-tight text-slate-950">
                  {resource.title}
                </h3>
              </div>

              <div className="academic-rule mt-5" />
              <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">
                {resource.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  className="button-primary"
                  href={resource.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open PDF
                </Link>
                <Link className="button-secondary" href={resource.href} download>
                  Download
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
