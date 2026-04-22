import Image from "next/image";
import Link from "next/link";
import { ModuleCatalog } from "@/components/module-catalog";
import { SetupBanner } from "@/components/setup-banner";
import { SiteFooter } from "@/components/site-footer";
import { modules, totalQuestions } from "@/lib/data/modules";
import { getSupabaseEnv } from "@/lib/supabase/env";

export default function HomePage() {
  const isConfigured = getSupabaseEnv().isConfigured;

  return (
    <div className="min-h-screen">
      <header className="chrome-header border-b border-white/45 bg-white/50 backdrop-blur-2xl">
        <div className="shell flex h-18 items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="logo-mark">NF</div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Nyantakyi Francis</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Elective Mathematics
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-3">
            <Link className="button-secondary" href="/signup">
              Create account
            </Link>
            <Link className="button-primary" href="/login">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <section className="shell py-12 sm:py-16">
        <div className="panel-soft relative overflow-hidden px-6 py-8 sm:px-10 sm:py-12">
          <div className="absolute right-[-80px] top-[-120px] h-72 w-72 rounded-full bg-blue-200/45 blur-3xl" />
          <div className="absolute bottom-[-100px] left-[-40px] h-60 w-60 rounded-full bg-amber-200/35 blur-3xl" />
          <div className="absolute inset-y-0 right-[34%] w-px bg-linear-to-b from-transparent via-slate-300/35 to-transparent" />

          <div className="relative grid gap-10 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
            <div>
              <span className="eyebrow">Migration-safe foundation</span>
              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
                Master Elective Mathematics with protected accounts, progress, and messaging.
              </h1>
              <div className="academic-rule mt-6" />
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                We are upgrading the portal into a learner platform: accounts, login-gated quizzes,
                tracked scores, personal inboxes, and an admin performance view powered by Supabase
                Postgres and Vercel.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link className="button-primary" href="/signup">
                  Start with an account
                </Link>
                <Link className="button-secondary" href="/dashboard">
                  Open dashboard
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="neo-stat rounded-[1.75rem] p-5">
                  <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Modules</p>
                  <p className="mt-2 text-3xl font-black text-slate-950">{modules.length}</p>
                </div>
                <div className="neo-stat rounded-[1.75rem] p-5">
                  <p className="text-sm uppercase tracking-[0.16em] text-slate-500">
                    Questions
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-950">{totalQuestions}</p>
                </div>
                <div className="neo-stat rounded-[1.75rem] p-5">
                  <p className="text-sm uppercase tracking-[0.16em] text-slate-500">
                    Capability
                  </p>
                  <p className="mt-2 text-xl font-black text-slate-950">Accounts + progress</p>
                </div>
              </div>
            </div>

            <div className="glass-card overflow-hidden rounded-[2rem] p-5">
              <div className="overflow-hidden rounded-[1.75rem] bg-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                <Image
                  alt="Nyantakyi Francis"
                  className="h-auto w-full object-cover"
                  height={640}
                  priority
                  src="/dp.PNG"
                  width={640}
                />
              </div>
              <div className="dark-panel mt-5 rounded-[1.75rem] px-5 py-4 text-slate-200">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                  Instructor-led platform vision
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Learners sign in before opening questions, see their own score history, receive
                  score messages, and progress through the curriculum with a real dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell pb-12">
        {!isConfigured ? (
          <SetupBanner
            message="Add your Supabase project URL and anon key in .env.local, then apply the SQL schema before protected pages can load real learner data."
            title="Supabase setup still needed"
          />
        ) : null}
      </section>

      <section className="shell pb-16">
        <ModuleCatalog modules={modules} />
      </section>

      <section className="shell pb-20">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-card rounded-[2rem] p-8">
            <span className="eyebrow">What changes next</span>
            <div className="mt-5 grid gap-4 text-sm leading-7 text-slate-600">
              <p>
                Protected module pages will replace the current public quiz files so questions and
                answers are delivered through the app, not static files.
              </p>
              <p>
                Quiz attempts will write to Postgres, making learner score history, averages, and
                weak-topic tracking available on the dashboard and admin pages.
              </p>
              <p>
                The message center will carry score notices, feedback, and direct admin
                announcements inside the platform.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-8">
            <span className="eyebrow">Protected routes</span>
            <ul className="mt-5 space-y-3 text-sm text-slate-600">
              <li>
                <span className="soft-well inline-flex rounded-full px-3 py-1 font-mono text-xs text-slate-700">
                  /login
                </span>{" "}
                and{" "}
                <span className="soft-well inline-flex rounded-full px-3 py-1 font-mono text-xs text-slate-700">
                  /signup
                </span>{" "}
                for accounts
              </li>
              <li>
                <span className="soft-well inline-flex rounded-full px-3 py-1 font-mono text-xs text-slate-700">
                  /dashboard
                </span>{" "}
                for progress snapshots
              </li>
              <li>
                <span className="soft-well inline-flex rounded-full px-3 py-1 font-mono text-xs text-slate-700">
                  /modules/[slug]
                </span>{" "}
                for gated quiz delivery
              </li>
              <li>
                <span className="soft-well inline-flex rounded-full px-3 py-1 font-mono text-xs text-slate-700">
                  /messages
                </span>{" "}
                for score notifications and broadcasts
              </li>
              <li>
                <span className="soft-well inline-flex rounded-full px-3 py-1 font-mono text-xs text-slate-700">
                  /admin
                </span>{" "}
                for learner performance monitoring
              </li>
            </ul>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
