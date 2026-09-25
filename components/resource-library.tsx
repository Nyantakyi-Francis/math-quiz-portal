"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ResourceMeta } from "@/lib/data/resources";

type ResourceLibraryProps = {
  resources: ResourceMeta[];
};

export function ResourceLibrary({ resources }: ResourceLibraryProps) {
  const [query, setQuery] = useState("");

  const filteredResources = useMemo(() => {
    const value = query.toLowerCase().trim();
    const indexedResources = resources.map((resource, index) => ({
      resource,
      resourceNumber: index + 1
    }));

    if (!value) {
      return indexedResources;
    }

    return indexedResources.filter(({ resource, resourceNumber }) =>
      [
        resource.title,
        resource.description,
        resource.slug,
        resource.sizeLabel,
        `resource ${resourceNumber}`,
        "pdf"
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [resources, query]);

  return (
    <section className="space-y-6">
      <div className="panel-soft flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-deep)]">
            All Resources
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Search by topic, description, file type, or file size.
          </p>
        </div>
        <label className="relative block min-w-0 sm:min-w-[280px]">
          <span className="sr-only">Search resources</span>
          <input
            className="field field-has-leading"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search resources..."
            type="search"
            value={query}
          />
          {query ? null : (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            >
              <svg
                aria-hidden="true"
                fill="none"
                height="18"
                viewBox="0 0 24 24"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M20 20l-3.5-3.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </span>
          )}
        </label>
      </div>

      {filteredResources.length ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredResources.map(({ resource, resourceNumber }) => (
            <article
              className={`glass-card group flex h-full flex-col border ${resource.tone.accent} p-6 transition hover:-translate-y-1`}
              key={resource.slug}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${resource.tone.badge} ${resource.tone.badgeText}`}
                >
                  Resource {resourceNumber}
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
        </div>
      ) : (
        <div className="panel-soft p-6 text-sm text-slate-600">
          No resources match <span className="font-semibold text-slate-800">{query.trim()}</span>.
        </div>
      )}
    </section>
  );
}
