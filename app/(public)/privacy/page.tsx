import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Math Quiz Portal",
  description: "How Math Quiz Portal handles learner account, quiz, resource, and message data."
};

const privacySections = [
  {
    title: "1. Data the portal collects",
    body:
      "The portal stores the details needed to run learner accounts: name, email address, optional phone number, account role, quiz attempts, scores, selected answers, messages, message read status, and Terms acceptance details."
  },
  {
    title: "2. Why the data is used",
    body:
      "The data is used to let learners sign in, practise mathematics topics, save quiz history, review scores, receive messages, and let authorised admins support learners."
  },
  {
    title: "3. Who can see learner data",
    body:
      "Learners can see their own profile, attempts, scores, messages, and protected resources. Admin users can see learner profiles, attempts, messages, and progress information needed to manage the portal."
  },
  {
    title: "4. Protected resources",
    body:
      "PDF resources are served through authenticated app routes. They are for learners and admins with portal accounts and should not be redistributed outside the portal unless the teacher or site administrator allows it."
  },
  {
    title: "5. Email notifications",
    body:
      "If email notifications are enabled, the portal may send message alerts to learner email addresses. Email delivery may use a third-party email provider configured by the site administrator."
  },
  {
    title: "6. Storage and service providers",
    body:
      "The app uses Supabase for authentication and database storage. It may also be hosted on a deployment platform such as Vercel. These providers process data so the portal can run."
  },
  {
    title: "7. Retention and deletion",
    body:
      "Learner records are kept while the account is active or while they are needed for classroom support. A learner can ask the teacher or site administrator to review, correct, or remove account data where possible."
  },
  {
    title: "8. Contact",
    body:
      "Questions about account data, resource access, or deletion requests should be sent to the teacher or site administrator responsible for the portal."
  }
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <header className="chrome-header border-b border-white/45 bg-white/50 backdrop-blur-2xl">
        <div className="shell flex flex-col gap-3 py-4 sm:h-18 sm:flex-row sm:items-center sm:justify-between">
          <Link className="flex items-center gap-3 focus-outline" href="/">
            <div className="logo-mark">NF</div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Math Quiz Portal</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Privacy Policy
              </p>
            </div>
          </Link>

          <nav className="flex flex-nowrap items-center gap-3">
            <Link className="button-secondary whitespace-nowrap" href="/terms">
              Terms
            </Link>
            <Link className="button-primary whitespace-nowrap" href="/signup">
              Create account
            </Link>
          </nav>
        </div>
      </header>

      <main className="shell py-12 sm:py-16">
        <section className="panel-soft overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="dark-panel rounded-none px-6 py-8 sm:px-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Effective October 1, 2026
              </p>
              <h1 className="mt-4 max-w-md text-4xl font-black tracking-tight text-white sm:text-5xl">
                Privacy Policy
              </h1>
              <div className="academic-rule mt-5" />
              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-200">
                This page explains what learner data the portal stores and how it is used inside
                the learning platform.
              </p>
            </div>

            <div className="space-y-6 px-6 py-8 sm:px-8">
              <div className="soft-well rounded-lg p-5">
                <p className="text-sm leading-7 text-slate-700">
                  This is a practical first draft for the current app. It should be reviewed before
                  the portal is used with a school, a large class, or learners who need parent or
                  guardian consent.
                </p>
              </div>

              <div className="grid gap-5">
                {privacySections.map((section) => (
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
                <Link className="button-secondary" href="/terms">
                  Read Terms
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
