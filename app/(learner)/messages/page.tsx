import { AppShell } from "@/components/app-shell";
import { SetupBanner } from "@/components/setup-banner";
import { getMessagesSnapshot } from "@/lib/db/portal";

export const dynamic = "force-dynamic";

type MessagesPageProps = {
  searchParams: Promise<{
    marked?: string;
    error?: string;
  }>;
};

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const params = await searchParams;
  const snapshot = await getMessagesSnapshot();

  return (
    <AppShell
      description="Learner inbox for score notifications, feedback, and admin broadcasts."
      role={snapshot.role}
      title="Message Center"
      userEmail={snapshot.userEmail}
    >
      <div className="space-y-8">
        {snapshot.warning ? (
          <SetupBanner message={snapshot.warning} title="Inbox setup" />
        ) : null}
        {params.marked ? (
          <SetupBanner message="All unread messages have been marked as read." title="Inbox updated" />
        ) : null}
        {params.error ? <SetupBanner message={params.error} title="Message action failed" /> : null}

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-lg font-bold text-slate-950">Inbox</p>
                <p className="mt-1 text-sm text-slate-500">
                  Score notices and admin messages are stored here for every learner account.
                </p>
              </div>
              {snapshot.totals.unreadMessages > 0 ? (
                <form action="/messages/mark-read" method="post">
                  <button className="button-secondary" type="submit">
                    Mark all as read
                  </button>
                </form>
              ) : null}
            </div>

            <div className="mt-6 space-y-4">
              {snapshot.messages.length ? (
                snapshot.messages.map((message) => (
                  <article
                    className={`rounded-3xl border px-5 py-4 ${
                      message.readAt
                        ? "border-slate-200 bg-slate-50"
                        : "border-blue-200 bg-blue-50/60"
                    }`}
                    key={message.id}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-900">{message.subject}</p>
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                        {message.type}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{message.body}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-400">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </article>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 px-5 py-8 text-sm text-slate-500">
                  Your inbox is empty for now. Score messages and admin announcements will appear
                  here as you use the platform.
                </div>
              )}
            </div>
          </div>

          <div className="panel p-6">
            <p className="text-lg font-bold text-slate-950">Message types</p>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">Score:</span> sent automatically
                after a learner submits a module.
              </p>
              <p>
                <span className="font-semibold text-slate-900">Admin:</span> direct feedback,
                reminders, or encouragement.
              </p>
              <p>
                <span className="font-semibold text-slate-900">Announcement:</span> class-wide
                broadcasts such as new module releases or deadlines.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
