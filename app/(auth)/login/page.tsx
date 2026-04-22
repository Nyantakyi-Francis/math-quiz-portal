import Link from "next/link";
import { normalizeAppPath } from "@/lib/auth/redirect";
import { SetupBanner } from "@/components/setup-banner";
import { getSupabaseEnv } from "@/lib/supabase/env";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = normalizeAppPath(params.next);
  const isConfigured = getSupabaseEnv().isConfigured;

  return (
    <main className="shell flex min-h-screen items-center justify-center py-12">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="panel-soft p-8 sm:p-10">
          <span className="eyebrow">Learner access</span>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950">
            Sign in before opening any quiz modules.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
            Authentication is the gate that lets us track module attempts, show personal score
            history, and deliver messages inside the learner dashboard.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="panel border-0 p-5">
              <p className="text-sm font-semibold text-slate-900">Learner dashboard</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Attempted modules, average score, and recent activity.
              </p>
            </div>
            <div className="panel border-0 p-5">
              <p className="text-sm font-semibold text-slate-900">Message center</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Score notices, admin broadcasts, and learner updates.
              </p>
            </div>
          </div>
        </section>

        <section className="panel p-8 sm:p-10">
          <p className="text-sm font-semibold text-slate-900">Welcome back</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Login</h2>

          <div className="mt-6 space-y-4">
            {!isConfigured ? (
              <SetupBanner
                message="Supabase is not configured yet. Add your environment variables first, then login will start working."
                title="Setup required"
              />
            ) : null}
            {params.error ? (
              <SetupBanner message={params.error} title="Login failed" />
            ) : null}
            {params.message ? (
              <SetupBanner message={params.message} title="Status" />
            ) : null}
          </div>

          <form action="/auth/login" className="mt-6 space-y-5" method="post">
            <input name="next" type="hidden" value={next} />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
                Email address
              </label>
              <input className="field" id="email" name="email" required type="email" />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
                htmlFor="password"
              >
                Password
              </label>
              <input className="field" id="password" name="password" required type="password" />
            </div>

            <button className="button-primary w-full" type="submit">
              Sign in
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-500">
            New here?{" "}
            <Link className="font-semibold text-blue-700 hover:text-blue-800" href="/signup">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
