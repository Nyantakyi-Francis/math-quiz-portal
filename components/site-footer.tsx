import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-transparent py-10 text-slate-500">
      <div className="shell flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
        <div className="dark-panel rounded-[2rem] px-6 py-5 md:flex-1">
          <p className="font-semibold tracking-[0.12em] text-white uppercase">Math Quiz Portal</p>
          <p className="mt-2 max-w-xl text-slate-300">
            Pure mathematics is, in its way, the poetry of logical ideas. — Albert Einstein
          </p>
        </div>
        <div className="panel flex flex-wrap items-center gap-3 px-5 py-4">
          <Link className="focus-outline text-slate-600 transition hover:text-[var(--brand-deep)]" href="/login">
            Login
          </Link>
          <Link className="focus-outline text-slate-600 transition hover:text-[var(--brand-deep)]" href="/signup">
            Create account
          </Link>
          <Link className="focus-outline text-slate-600 transition hover:text-[var(--brand-deep)]" href="/dashboard">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
