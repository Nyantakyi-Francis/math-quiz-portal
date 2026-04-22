import { AppShell } from "@/components/app-shell";
import { LearnerModuleCatalog } from "@/components/learner-module-catalog";
import { SetupBanner } from "@/components/setup-banner";
import { getDashboardSnapshot } from "@/lib/db/portal";
import { modules } from "@/lib/data/modules";

export const dynamic = "force-dynamic";

export default async function ModulesPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <AppShell
      description="Browse every protected module in the learner portal."
      role={snapshot.role}
      title="Module Catalog"
      userEmail={snapshot.userEmail}
    >
      <div className="space-y-8">
        {snapshot.warning ? (
          <SetupBanner message={snapshot.warning} title="Protected data setup" />
        ) : null}

        <LearnerModuleCatalog modules={modules} />
      </div>
    </AppShell>
  );
}
