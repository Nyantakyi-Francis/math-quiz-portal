import Link from "next/link";
import type { ModuleMeta } from "@/lib/data/modules";

type ModuleCatalogProps = {
  modules: ModuleMeta[];
};

export function ModuleCatalog({ modules }: ModuleCatalogProps) {
  return (
    <section className="space-y-6">
      <div className="panel-soft p-5">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-deep)]">
            Module Catalog
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Learners will sign in before accessing module questions, results, and feedback.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <article
            className={`glass-card flex h-full flex-col border ${module.tone.accent} rounded-[2rem] p-6 transition hover:-translate-y-1`}
            key={module.slug}
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${module.tone.badge} ${module.tone.badgeText}`}
              >
                Module {module.moduleNumber}
              </span>
              <span className="soft-well rounded-full px-3 py-1 text-xs font-medium text-slate-600">
                {module.difficulty}
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">{module.title}</h3>
            <div className="academic-rule mt-4" />
            <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{module.description}</p>

            <div className="soft-well mt-5 flex items-center justify-between rounded-[1.35rem] px-4 py-3 text-sm text-slate-500">
              <span>{module.questionCount} questions</span>
              
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="button-primary" href={`/login?next=/modules/${module.slug}`}>
                Login to start
              </Link>
              <Link className="button-secondary" href={`/modules/${module.slug}`}>
                View module
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
