import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SetupBanner } from "@/components/setup-banner";
import { AdminThreadMarkRead } from "@/components/admin-thread-mark-read";
import { getAdminMessagesSnapshot } from "@/lib/db/portal";

export const dynamic = "force-dynamic";

type AdminMessagesPageProps = {
  searchParams: Promise<{
    learner?: string;
    sent?: string;
    error?: string;
  }>;
};

export default async function AdminMessagesPage({ searchParams }: AdminMessagesPageProps) {
  const params = await searchParams;
  const snapshot = await getAdminMessagesSnapshot(params.learner);

  return (
    <AppShell
      description="Admin message center for learner chats and replies."
      role={snapshot.authorized ? "admin" : "learner"}
      title="Admin Messages"
      userEmail={snapshot.userEmail}
      userPhone={snapshot.userPhone}
    >
      <div className="space-y-8">
        {snapshot.warning ? <SetupBanner message={snapshot.warning} title="Admin messages" /> : null}
        {params.sent ? (
          <SetupBanner
            message={`Message delivered to ${params.sent} learner${params.sent === "1" ? "" : "s"}.`}
            title="Message sent"
          />
        ) : null}
        {params.error ? <SetupBanner message={params.error} title="Message failed" /> : null}

        {!snapshot.authorized ? (
          <div className="panel p-6 text-sm leading-7 text-slate-600">
            This page is protected by login. Set your `profiles.role` value to `admin` in Supabase
            to unlock learner chats.
          </div>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="panel overflow-hidden">
              <div className="border-b border-slate-200/70 px-5 py-4 sm:px-6">
                <p className="text-lg font-bold text-slate-950">Learners</p>
                <p className="mt-1 text-sm text-slate-500">
                  Select a learner to open the chat thread (WhatsApp-style).
                </p>
              </div>

              <div className="soft-well max-h-[70vh] min-h-[28rem] space-y-3 overflow-y-auto rounded-none border-x-0 border-t-0 px-4 py-6 sm:px-6">
                {snapshot.learners.length ? (
                  snapshot.learners.map((learner) => {
                    const isActive = snapshot.selectedLearner?.id === learner.id;

                    return (
                      <Link
                        className={`block rounded-3xl border px-5 py-4 transition ${
                          isActive
                            ? "border-blue-200 bg-blue-50/70"
                            : "border-slate-200 bg-white/70 hover:border-blue-200/70 hover:bg-white"
                        }`}
                        href={`/admin/messages?learner=${learner.id}`}
                        key={learner.id}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {learner.fullName ?? "Unnamed learner"}
                            </p>
                            <p className="truncate text-xs text-slate-500">{learner.email}</p>
                          </div>

                          {learner.unreadCount > 0 ? (
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-900">
                              {learner.unreadCount}
                            </span>
                          ) : null}
                        </div>

                        {learner.lastMessagePreview ? (
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                            {learner.lastMessagePreview}
                          </p>
                        ) : (
                          <p className="mt-3 text-sm text-slate-500">
                            No chat messages yet.
                          </p>
                        )}

                        {learner.lastMessageAt ? (
                          <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">
                            {new Date(learner.lastMessageAt).toLocaleString()}
                          </p>
                        ) : null}
                      </Link>
                    );
                  })
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-300 px-5 py-12 text-center text-sm text-slate-500">
                    No learners found yet.
                  </div>
                )}
              </div>
            </div>

            <div className="panel overflow-hidden">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/70 px-5 py-4 sm:px-6">
                <div>
                  <p className="text-lg font-bold text-slate-950">
                    {snapshot.selectedLearner
                      ? snapshot.selectedLearner.fullName ?? "Learner chat"
                      : "Chat thread"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {snapshot.selectedLearner
                      ? "Reply to the learner and review the full chat history."
                      : "Choose a learner on the left to start."}
                  </p>
                </div>

                {snapshot.selectedLearner ? (
                  <Link className="button-secondary" href="/admin">
                    Back to admin console
                  </Link>
                ) : null}
              </div>

              {snapshot.selectedLearner ? (
                <>
                  <AdminThreadMarkRead learnerId={snapshot.selectedLearner.id} />

                  <div className="soft-well max-h-[56vh] min-h-[22rem] overflow-y-auto rounded-none border-x-0 border-t-0 px-4 py-6 sm:px-6">
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
                                className={`message-bubble max-w-[min(44rem,88%)] rounded-[1.4rem] border px-4 py-3 shadow-sm ${
                                  isOutgoing
                                    ? "border-blue-200 bg-blue-600 text-white"
                                    : message.readAt
                                      ? "message-bubble-incoming-read"
                                      : "message-bubble-incoming-unread"
                                }`}
                              >
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`text-xs font-bold uppercase tracking-[0.16em] ${
                                      isOutgoing ? "text-blue-50" : "text-slate-600"
                                    }`}
                                  >
                                    {message.senderLabel}
                                  </span>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${
                                      isOutgoing ? "bg-white/15 text-blue-50" : "message-pill"
                                    }`}
                                  >
                                    {message.type}
                                  </span>
                                </div>
                                <p
                                  className={`mt-2 text-sm font-semibold ${
                                    isOutgoing ? "text-white" : ""
                                  }`}
                                >
                                  {message.subject}
                                </p>
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                                  {message.body}
                                </p>
                                <p
                                  className={`mt-3 text-right text-[0.72rem] ${
                                    isOutgoing ? "text-blue-50" : "text-slate-500"
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
                      <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-14 text-center">
                        <p className="text-sm font-semibold text-slate-900">No messages yet</p>
                        <p className="mt-2 text-sm text-slate-500">
                          Send the first message to start the conversation.
                        </p>
                      </div>
                    )}
                  </div>

                  <form action="/admin/messages/send" className="space-y-4 px-5 py-5 sm:px-6" method="post">
                    <input name="audience" type="hidden" value="single" />
                    <input name="recipient_id" type="hidden" value={snapshot.selectedLearner.id} />
                    <input name="message_type" type="hidden" value="admin" />
                    <input
                      name="return_to"
                      type="hidden"
                      value={`/admin/messages?learner=${snapshot.selectedLearner.id}`}
                    />
                    <input name="subject" type="hidden" value="Chat message" />

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="body">
                        Message
                      </label>
                      <textarea
                        className="field min-h-28 resize-y"
                        id="body"
                        name="body"
                        placeholder="Type your reply..."
                        required
                      />
                    </div>

                    <button className="button-primary w-full" type="submit">
                      Send message
                    </button>
                  </form>
                </>
              ) : (
                <div className="px-6 py-14 text-center text-sm text-slate-500">
                  Pick a learner to view and send messages.
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}

