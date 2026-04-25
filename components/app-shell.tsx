import Link from "next/link";

type AppShellProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  userEmail: string | null;
  userPhone?: string | null;
  role?: string;
};

export function AppShell({
  children,
  title,
  description,
  userEmail,
  userPhone = null,
  role = "learner"
}: AppShellProps) {
  const messagesHref = role === "admin" ? "/admin/messages" : "/messages";

  return (
    <div className="min-h-screen">
      <header className="chrome-header sticky top-0 z-40 border-b border-white/45 bg-white/50 shadow-[0_24px_60px_-42px_rgba(17,24,39,0.42)] backdrop-blur-2xl">
        <div className="shell flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="logo-mark">NF</div>
            <div>
              <Link className="focus-outline text-lg font-black tracking-tight text-slate-900" href="/">
                Math Quiz Portal
              </Link>
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link className="button-secondary" href="/dashboard">
              Dashboard
            </Link>
            <Link className="button-secondary" href="/modules">
              Modules
            </Link>
            <Link className="button-secondary" href={messagesHref}>
              Messages
            </Link>
            <Link className="button-secondary" href="/admin">
              Admin
            </Link>
            <div className="soft-well rounded-full px-4 py-2 text-slate-700">
              <p>{userEmail ?? "Signed in"}</p>
              {userPhone ? <p className="mt-1 text-xs text-slate-500">{userPhone}</p> : null}
              <span className="mt-1 inline-block text-xs uppercase tracking-[0.16em] text-slate-500">
                {role}
              </span>
            </div>
            <form action="/auth/signout" method="post">
              <button className="button-primary" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="shell py-10">
        <div className="mb-8">
          <p className="eyebrow">Protected Portal</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h1>
          <div className="academic-rule mt-4" />
        </div>
        {children}
      </main>
    </div>
  );
}
