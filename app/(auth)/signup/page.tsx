import Link from "next/link";
import { SetupBanner } from "@/components/setup-banner";
import { getSupabaseEnv } from "@/lib/supabase/env";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const isConfigured = getSupabaseEnv().isConfigured;

  return (
    <main className="shell flex min-h-screen items-center justify-center py-12">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="panel-soft p-8 sm:p-10">
          <span className="eyebrow">Create a learner account</span>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950">
            Start the database-backed version of the portal.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
            Account creation is the first step toward protected quizzes, persistent scores, admin
            reporting, and in-app messaging.
          </p>

          <div className="mt-8 space-y-4 text-sm leading-7 text-slate-600">
            <p>Each learner gets a profile, attempt history, and personal message inbox.</p>
            <p>Admins get a separate monitoring view for learners, attempts, and announcements.</p>
            <p>The current quiz bank will be migrated into Postgres module by module.</p>
          </div>
        </section>

        <section className="panel p-8 sm:p-10">
          <p className="text-sm font-semibold text-slate-900">Join the platform</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            Create account
          </h2>

          <div className="mt-6 space-y-4">
            {!isConfigured ? (
              <SetupBanner
                message="Supabase is not configured yet. Add your environment variables before testing signup."
                title="Setup required"
              />
            ) : null}
            {params.error ? (
              <SetupBanner message={params.error} title="Signup failed" />
            ) : null}
            {params.success ? (
              <SetupBanner message={params.success} title="Check your email" />
            ) : null}
          </div>

          <form action="/auth/signup" className="mt-6 space-y-5" method="post">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="full_name">
                Full name
              </label>
              <input className="field" id="full_name" name="full_name" required type="text" />
            </div>

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
              <input
                className="field"
                id="password"
                minLength={8}
                name="password"
                required
                type="password"
              />
            </div>

            <button className="button-primary w-full" type="submit">
              Create account
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-500">
            Already have an account?{" "}
            <Link className="font-semibold text-blue-700 hover:text-blue-800" href="/login">
              Login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
