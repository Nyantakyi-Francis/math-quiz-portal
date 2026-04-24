import { AppShell } from "@/components/app-shell";
import { SetupBanner } from "@/components/setup-banner";
import { getMessagesSnapshot } from "@/lib/db/portal";

export const dynamic = "force-dynamic";

type MessagesPageProps = {
  searchParams: Promise<{
    marked?: string;
    sent?: string;
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
      userPhone={snapshot.userPhone}
    >
      <div className="space-y-8">
        {snapshot.warning ? (
          <SetupBanner message={snapshot.warning} title="Inbox setup" />
        ) : null}
        {params.marked ? (
          <SetupBanner message="All unread messages have been marked as read." title="Inbox updated" />
        ) : null}
        {params.sent ? (
          <SetupBanner
            message={`Your message was delivered to ${params.sent} admin account${params.sent === "1" ? "" : "s"}.`}
            title="Message sent"
          />
        ) : null}
        {params.error ? <SetupBanner message={params.error} title="Message action failed" /> : null}

        <section className="panel overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/70 px-5 py-4 sm:px-6">
            <div>
              <p className="text-lg font-bold text-slate-950">Admin conversation</p>
              <p className="mt-1 text-sm text-slate-500">
                Score updates, admin notes, announcements, and your replies are kept together.
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

          <div className="soft-well max-h-[62vh] min-h-[28rem] overflow-y-auto rounded-none border-x-0 border-t-0 px-4 py-6 sm:px-6">
            {snapshot.messages.length ? (
              <div className="space-y-4">
                {snapshot.messages.map((message) => {
                  const isOutgoing = message.direction === "outgoing";

                  return (
                    <article
                      className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}
                      key={message.id}
                    >
                      <div
                        className={`max-w-[min(44rem,88%)] rounded-[1.4rem] border px-4 py-3 shadow-sm ${
                          isOutgoing
                            ? "border-blue-200 bg-blue-600 text-white"
                            : message.readAt
                              ? "border-slate-200 bg-white/85 text-slate-700"
                              : "border-amber-200 bg-amber-50/90 text-slate-800"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-xs font-bold uppercase tracking-[0.16em] ${
                              isOutgoing ? "text-blue-100" : "text-slate-400"
                            }`}
                          >
                            {message.senderLabel}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${
                              isOutgoing
                                ? "bg-white/15 text-blue-50"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {message.type}
                          </span>
                        </div>
                        <p
                          className={`mt-2 text-sm font-semibold ${
                            isOutgoing ? "text-white" : "text-slate-950"
                          }`}
                        >
                          {message.subject}
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{message.body}</p>
                        <p
                          className={`mt-3 text-right text-[0.72rem] ${
                            isOutgoing ? "text-blue-100" : "text-slate-400"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-[22rem] items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 px-5 text-center text-sm text-slate-500">
                Your conversation is empty for now. Score messages and admin announcements will
                appear here as you use the platform.
              </div>
            )}
          </div>

          {snapshot.role === "learner" ? (
            <div className="border-t border-slate-200/70 p-4 sm:p-5">
              {snapshot.adminContacts.length ? (
                <form action="/messages/send" className="flex flex-col gap-3 sm:flex-row" method="post">
                  <input name="subject" type="hidden" value="Learner reply" />
                  <label className="sr-only" htmlFor="body">
                    Message
                  </label>
                  <textarea
                    className="field min-h-20 flex-1 resize-y rounded-[1.2rem]"
                    id="body"
                    name="body"
                    placeholder="Type a reply or new message to admin..."
                    required
                  />
                  <button className="button-primary self-stretch sm:self-end" type="submit">
                    Send
                  </button>
                </form>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-slate-300 px-5 py-5 text-sm text-slate-500">
                  No admin account is available yet, so learner messages cannot be delivered.
                </div>
              )}
            </div>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}
