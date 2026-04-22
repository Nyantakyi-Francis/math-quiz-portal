"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ModuleMeta } from "@/lib/data/modules";

type LearnerModuleCatalogProps = {
  modules: ModuleMeta[];
};

export function LearnerModuleCatalog({ modules }: LearnerModuleCatalogProps) {
  const [query, setQuery] = useState("");

  const filteredModules = useMemo(() => {
    const value = query.toLowerCase().trim();

    if (!value) {
      return modules;
    }

    return modules.filter((module) => module.title.toLowerCase().includes(value));
  }, [modules, query]);

  return (
    <section className="space-y-6">
      <div className="panel-soft flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-deep)]">
            All Modules
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Open any protected module and your score will feed your dashboard and inbox.
          </p>
        </div>
        <label className="relative block min-w-[280px]">
          <span className="sr-only"></span>
          <input
            className="field pl-11"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
            type="search"
            value={query}
          />
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            Search
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredModules.map((module) => (
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
              <span>Tracked progress</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="button-primary" href={`/modules/${module.slug}`}>
                Start module
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
