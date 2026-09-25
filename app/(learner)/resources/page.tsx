import { AppShell } from "@/components/app-shell";
import { ResourceLibrary } from "@/components/resource-library";
import { SetupBanner } from "@/components/setup-banner";
import { resources } from "@/lib/data/resources";
import { getPortalShellSnapshot } from "@/lib/db/portal";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const snapshot = await getPortalShellSnapshot();

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
                Topic packs are gathered in one protected place, with links that are easy to open
                during revision.
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
                <p className="text-3xl font-black text-slate-950">{resources.length}</p>
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

        <ResourceLibrary resources={resources} />
      </div>
    </AppShell>
  );
}
