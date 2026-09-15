import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { TERMS_EFFECTIVE_DATE } from "@/lib/legal/terms";

export const metadata: Metadata = {
  title: "Terms of Service | Math Quiz Portal",
  description: "Terms for using the Math Quiz Portal learning platform."
};

const termsSections = [
  {
    title: "1. Account use",
    body:
      "You must provide accurate signup details and keep your login information private. Your account is for your own learning activity and should not be shared with another learner."
  },
  {
    title: "2. Learning content",
    body:
      "The quizzes, notes, score history, and messages are provided for mathematics practice and classroom support. They do not replace your teacher's instructions, school policies, or formal assessment requirements."
  },
  {
    title: "3. Acceptable use",
    body:
      "Do not attempt to bypass access controls, view answer keys outside the intended results flow, disrupt the service, upload harmful content, or use the platform to send abusive messages."
  },
  {
    title: "4. Learner data",
    body:
      "The platform stores account details, quiz attempts, scores, and messages so learners can continue their work and receive feedback. Access is limited by learner and admin roles inside the platform."
  },
  {
    title: "5. Service availability",
    body:
      "The portal may be unavailable during maintenance, hosting issues, or database configuration work. If account creation or login is unavailable, try again later or contact the teacher."
  },
  {
    title: "6. Account removal",
    body:
      "If you do not want to keep using the platform, contact the teacher or site administrator to request account removal where possible."
  },
  {
    title: "7. Changes to these Terms",
    body:
      "These Terms may be updated as the platform changes. New users will be asked to accept the current version during signup."
  }
];

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <header className="chrome-header border-b border-white/45 bg-white/50 backdrop-blur-2xl">
        <div className="shell flex flex-col gap-3 py-4 sm:h-18 sm:flex-row sm:items-center sm:justify-between">
          <Link className="flex items-center gap-3 focus-outline" href="/">
            <div className="logo-mark">NF</div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Math Quiz Portal</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Terms of Service
              </p>
            </div>
          </Link>

          <nav className="flex flex-nowrap items-center gap-3">
            <Link className="button-secondary whitespace-nowrap" href="/signup">
              Create account
            </Link>
            <Link className="button-primary whitespace-nowrap" href="/login">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="shell py-12 sm:py-16">
        <section className="panel-soft overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="dark-panel rounded-none px-6 py-8 sm:px-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Effective {TERMS_EFFECTIVE_DATE}
              </p>
              <h1 className="mt-4 max-w-md text-4xl font-black tracking-tight text-white sm:text-5xl">
                Terms of Service
              </h1>
              <div className="academic-rule mt-5" />
              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-200">
                These Terms explain the basic rules for learner accounts, quiz practice, shared
                resources, and messages in the Math Quiz Portal.
              </p>
            </div>

            <div className="space-y-6 px-6 py-8 sm:px-8">
              <div className="soft-well rounded-lg p-5">
                <p className="text-sm leading-7 text-slate-700">
                  By creating an account, you agree to these Terms. If you do not agree, do not
                  create an account or use the protected learning areas.
                </p>
              </div>

              <div className="grid gap-5">
                {termsSections.map((section) => (
                  <article
                    className="border-b border-slate-200 pb-5 last:border-b-0 last:pb-0"
                    key={section.title}
                  >
                    <h2 className="text-lg font-black tracking-tight text-slate-950">
                      {section.title}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{section.body}</p>
                  </article>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link className="button-primary" href="/signup">
                  Create account
                </Link>
                <Link className="button-secondary" href="/">
                  Back home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
