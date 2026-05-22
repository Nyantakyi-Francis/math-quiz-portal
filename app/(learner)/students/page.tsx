import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { SetupBanner } from "@/components/setup-banner";
import { getCurrentSession, getStudentMessagesSnapshot } from "@/lib/db/portal";

export const dynamic = "force-dynamic";

type StudentsPageProps = {
  searchParams: Promise<{
    student?: string;
    marked?: string;
    sent?: string;
    error?: string;
  }>;
};

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  const params = await searchParams;
  const session = await getCurrentSession();

  if (session.supabase && session.user) {
    const { data: profile } = await session.supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle();

    if (profile?.role === "admin") {
      redirect("/admin/messages");
    }
  }

  const snapshot = await getStudentMessagesSnapshot(params.student);

  return (
    <AppShell
      description="Student directory and peer-to-peer messages."
      role={snapshot.role}
      title="Students"
      userEmail={snapshot.userEmail}
      userPhone={snapshot.userPhone}
    >
      <div className="space-y-8">
        {snapshot.warning ? <SetupBanner message={snapshot.warning} title="Student messaging" /> : null}
        {params.marked ? (
          <SetupBanner message="Messages from this student have been marked as read." title="Thread updated" />
        ) : null}
        {params.sent ? <SetupBanner message="Your message was delivered." title="Message sent" /> : null}
        {params.error ? <SetupBanner message={params.error} title="Message action failed" /> : null}

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="panel overflow-hidden">
            <div className="border-b border-slate-200/70 px-5 py-4 sm:px-6">
              <p className="text-lg font-bold text-slate-950">Class roster</p>
              <p className="mt-1 text-sm text-slate-500">
                Pick a student to open a private message thread.
              </p>
            </div>

            <div className="max-h-[68vh] overflow-y-auto px-4 py-4 sm:px-6">
              {snapshot.students.length ? (
                <div className="space-y-3">
                  {snapshot.students.map((student) => {
                    const isSelected = snapshot.selectedStudent?.id === student.id;

                    return (
                      <Link
                        className={`block rounded-2xl border px-4 py-3 text-sm transition ${
                          isSelected ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:bg-slate-50"
                        }`}
                        href={`/students?student=${student.id}`}
                        key={student.id}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-slate-900">{student.displayName}</p>
                          {student.unreadCount ? (
                            <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                              {student.unreadCount}
                            </span>
                          ) : null}
                        </div>
                        {student.lastMessagePreview ? (
                          <p className="mt-2 line-clamp-2 text-slate-500">{student.lastMessagePreview}</p>
                        ) : (
                          <p className="mt-2 text-slate-400">No messages yet.</p>
                        )}
                        {student.lastMessageAt ? (
                          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                            {new Date(student.lastMessageAt).toLocaleString()}
                          </p>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-8 text-center text-sm text-slate-500">
                  No other students are listed yet.
                </div>
              )}
            </div>
          </div>

          <div className="panel overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 px-5 py-4 sm:px-6">
              <div>
                <p className="text-lg font-bold text-slate-950">
                  {snapshot.selectedStudent ? snapshot.selectedStudent.displayName : "Student thread"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {snapshot.selectedStudent
                    ? "Messages are visible only to you and the selected student."
                    : "Select a student to view and send messages."}
                </p>
              </div>
              {snapshot.selectedStudent ? (
                <form action="/students/mark-read" method="post">
                  <input name="student_id" type="hidden" value={snapshot.selectedStudent.id} />
                  <button className="button-secondary" type="submit">
                    Mark as read
                  </button>
                </form>
              ) : null}
            </div>

            <div className="soft-well max-h-[62vh] min-h-[28rem] overflow-y-auto rounded-none border-x-0 border-t-0 px-4 py-6 sm:px-6">
              {snapshot.selectedStudent ? (
                snapshot.messages.length ? (
                  <div className="space-y-4">
                    {snapshot.messages.map((message) => {
                      const isOutgoing = message.direction === "outgoing";

                      return (
                        <article className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`} key={message.id}>
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
                            <p className={`mt-2 text-sm font-semibold ${isOutgoing ? "text-white" : ""}`}>
                              {message.subject}
                            </p>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{message.body}</p>
                            <p className={`mt-3 text-right text-[0.72rem] ${isOutgoing ? "text-blue-50" : "text-slate-500"}`}>
                              {new Date(message.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex min-h-[22rem] items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 px-5 text-center text-sm text-slate-500">
                    This conversation is empty. Send the first message to start it.
                  </div>
                )
              ) : (
                <div className="flex min-h-[22rem] items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 px-5 text-center text-sm text-slate-500">
                  Pick a student from the roster to begin.
                </div>
              )}
            </div>

            {snapshot.selectedStudent ? (
              <div className="border-t border-slate-200/70 p-4 sm:p-5">
                <form action="/students/send" className="flex flex-col gap-3 sm:flex-row" method="post">
                  <input name="recipient_id" type="hidden" value={snapshot.selectedStudent.id} />
                  <input name="subject" type="hidden" value="Student message" />
                  <label className="sr-only" htmlFor="body">
                    Message
                  </label>
                  <textarea
                    className="field min-h-20 flex-1 resize-y rounded-[1.2rem]"
                    id="body"
                    name="body"
                    placeholder={`Message ${snapshot.selectedStudent.displayName}...`}
                    required
                  />
                  <button className="button-primary self-stretch sm:self-end" type="submit">
                    Send
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

