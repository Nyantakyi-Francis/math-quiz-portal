import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { SetupBanner } from "@/components/setup-banner";
import { getMessageDetailSnapshot } from "@/lib/db/portal";

type MessageDetailPageProps = {
  params: Promise<{
    messageId: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function MessageDetailPage({ params }: MessageDetailPageProps) {
  const { messageId } = await params;
  const snapshot = await getMessageDetailSnapshot(messageId);

  if (!snapshot.message && !snapshot.warning) {
    notFound();
  }

  return (
    <AppShell
      description="Open an inbox message and review the full message details."
      role={snapshot.role}
      title={snapshot.message?.subject ?? "Message"}
      userEmail={snapshot.userEmail}
      userPhone={snapshot.userPhone}
    >
      <div className="space-y-8">
        {snapshot.warning ? (
          <SetupBanner message={snapshot.warning} title="Message detail" />
        ) : null}

        {snapshot.message ? (
          <section className="panel p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-slate-500">From</p>
                <p className="mt-2 text-xl font-bold text-slate-950">{snapshot.message.senderLabel}</p>
                {snapshot.message.senderEmail ? (
                  <p className="mt-1 text-sm text-slate-500">{snapshot.message.senderEmail}</p>
                ) : null}
                {snapshot.message.senderPhone ? (
                  <p className="mt-1 text-sm text-slate-500">{snapshot.message.senderPhone}</p>
                ) : null}
              </div>

              <div className="text-right">
                <span className="message-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                  {snapshot.message.type}
                </span>
                <p className="mt-3 text-sm text-slate-500">
                  Sent {new Date(snapshot.message.createdAt).toLocaleString()}
                </p>
                {snapshot.message.readAt ? (
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                    Opened {new Date(snapshot.message.readAt).toLocaleString()}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="academic-rule mt-6" />

            <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {snapshot.message.body}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="button-secondary" href="/messages">
                Back to inbox
              </Link>
              <Link className="button-primary" href="/dashboard">
                Go to dashboard
              </Link>
            </div>
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
