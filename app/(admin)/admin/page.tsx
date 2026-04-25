import { AppShell } from "@/components/app-shell";
import { SetupBanner } from "@/components/setup-banner";
import { getAdminSnapshot } from "@/lib/db/portal";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams: Promise<{
    sent?: string;
    error?: string;
  }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const snapshot = await getAdminSnapshot();

  return (
    <AppShell
      description="Admin monitoring for learner profiles, attempts, and messaging workflows."
      role={snapshot.authorized ? "admin" : "learner"}
      title="Admin Console"
      userEmail={snapshot.userEmail}
      userPhone={snapshot.userPhone}
    >
      <div className="space-y-8">
        {snapshot.warning ? (
          <SetupBanner message={snapshot.warning} title="Admin access" />
        ) : null}
        {params.sent ? (
          <SetupBanner
            message={`Message sent successfully to ${params.sent} learner${params.sent === "1" ? "" : "s"}.`}
            title="Message delivered"
          />
        ) : null}
        {params.error ? <SetupBanner message={params.error} title="Message failed" /> : null}

        {!snapshot.authorized ? (
          <div className="panel p-6 text-sm leading-7 text-slate-600">
            This page is already protected by login. After you apply the schema, set your own
            `profiles.role` value to `admin` in Supabase to unlock learner and performance data.
          </div>
        ) : (
          <div className="space-y-6">
            <section className="grid gap-5 md:grid-cols-3">
              <div className="panel p-6">
                <p className="text-sm text-slate-500">Learners</p>
                <p className="mt-3 text-4xl font-black text-slate-950">{snapshot.learners.length}</p>
              </div>
              <div className="panel p-6">
                <p className="text-sm text-slate-500">Recent attempts</p>
                <p className="mt-3 text-4xl font-black text-slate-950">{snapshot.attempts.length}</p>
              </div>
              <div className="panel p-6">
                <p className="text-sm text-slate-500">Recent sent messages</p>
                <p className="mt-3 text-4xl font-black text-slate-950">
                  {snapshot.sentMessages.length}
                </p>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="panel p-6">
                <p className="text-lg font-bold text-slate-950">Send message</p>
                <p className="mt-1 text-sm text-slate-500">
                  Send a class-wide announcement or a direct message to one learner.
                </p>

                <form action="/admin/messages/send" className="mt-6 space-y-5" method="post">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="audience">
                      Audience
                    </label>
                    <select className="field" defaultValue="all" id="audience" name="audience">
                      <option value="all">All learners</option>
                      <option value="single">One learner</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="mb-2 block text-sm font-medium text-slate-700"
                      htmlFor="recipient_id"
                    >
                      Learner for direct message
                    </label>
                    <select className="field" defaultValue="" id="recipient_id" name="recipient_id">
                      <option value="">Choose a learner if sending direct</option>
                      {snapshot.learners
                        .filter((learner) => learner.role === "learner")
                        .map((learner) => (
                          <option key={learner.id} value={learner.id}>
                            {(learner.fullName ?? "Unnamed learner") + " - " + learner.email}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className="mb-2 block text-sm font-medium text-slate-700"
                      htmlFor="message_type"
                    >
                      Message type
                    </label>
                    <select
                      className="field"
                      defaultValue="announcement"
                      id="message_type"
                      name="message_type"
                    >
                      <option value="announcement">Announcement</option>
                      <option value="admin">Direct admin note</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="subject">
                      Subject
                    </label>
                    <input className="field" id="subject" name="subject" required type="text" />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="body">
                      Message body
                    </label>
                    <textarea className="field min-h-36 resize-y" id="body" name="body" required />
                  </div>

                  <button className="button-primary w-full" type="submit">
                    Send message
                  </button>
                </form>
              </div>

              <div className="space-y-6">
                <div className="panel p-6">
                  <p className="text-lg font-bold text-slate-950">Recent learners</p>
                  <div className="mt-6 space-y-3">
                    {snapshot.learners.map((learner) => (
                      <div
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                        key={learner.id}
                      >
                        <p className="font-semibold text-slate-900">
                          {learner.fullName ?? "Unnamed learner"}
                        </p>
                        <p className="text-slate-500">{learner.email}</p>
                        {learner.phone ? <p className="text-slate-500">{learner.phone}</p> : null}
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                          {learner.role} • joined {new Date(learner.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel p-6">
                  <p className="text-lg font-bold text-slate-950">Recent performance</p>
                  <div className="mt-6 space-y-3">
                    {snapshot.attempts.map((attempt) => (
                      <div
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                        key={attempt.id}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">{attempt.learnerName}</p>
                            <p className="text-slate-500">{attempt.moduleTitle}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-black text-blue-700">
                              {attempt.scorePercent.toFixed(1)}%
                            </p>
                            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                              {new Date(attempt.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel p-6">
                  <p className="text-lg font-bold text-slate-950">Recent sent messages</p>
                  <div className="mt-6 space-y-3">
                    {snapshot.sentMessages.length ? (
                      snapshot.sentMessages.map((message) => (
                        <div
                          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                          key={message.id}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold text-slate-900">{message.subject}</p>
                            <span className="message-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                              {message.type}
                            </span>
                          </div>
                          <p className="mt-2 text-slate-500">
                            {message.recipientCount} recipient{message.recipientCount === 1 ? "" : "s"}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-sm text-slate-500">
                        No admin messages have been sent yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </AppShell>
  );
}
