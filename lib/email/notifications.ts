import { getSiteUrl } from "@/lib/supabase/env";

type EmailRecipient = {
  email: string;
  name?: string | null;
};

type MessageEmailNotificationInput = {
  request: Request;
  recipients: EmailRecipient[];
  senderLabel: string;
  subject: string;
  body: string;
  linkPath: string;
};

function isEmailNotificationsEnabled() {
  const value = (process.env.ENABLE_MESSAGE_EMAIL_NOTIFICATIONS ?? "").trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes" || value === "on";
}

function getMaxEmailRecipients() {
  const raw = Number(process.env.EMAIL_NOTIFICATIONS_MAX_RECIPIENTS ?? 20);
  return Number.isFinite(raw) && raw > 0 ? raw : 20;
}

export async function notifyMessageRecipientsByEmail(input: MessageEmailNotificationInput) {
  if (!isEmailNotificationsEnabled()) {
    return { sent: 0, skipped: true as const, reason: "disabled" as const };
  }

  const apiKey = (process.env.RESEND_API_KEY ?? "").trim();
  const from = (process.env.EMAIL_FROM ?? "").trim();

  if (!apiKey || !from) {
    return { sent: 0, skipped: true as const, reason: "not_configured" as const };
  }

  const recipients = input.recipients
    .map((recipient) => recipient.email.trim())
    .filter(Boolean);

  if (!recipients.length) {
    return { sent: 0, skipped: true as const, reason: "no_recipients" as const };
  }

  const maxRecipients = getMaxEmailRecipients();

  if (recipients.length > maxRecipients) {
    return { sent: 0, skipped: true as const, reason: "too_many_recipients" as const };
  }

  const origin = getSiteUrl(input.request);
  const link = new URL(input.linkPath, origin).toString();
  const messagePreview = input.body.replace(/\s+/g, " ").trim().slice(0, 240);

  const text = [
    `New message from ${input.senderLabel}`,
    "",
    `Subject: ${input.subject}`,
    "",
    messagePreview,
    messagePreview.length < input.body.trim().length ? "..." : "",
    "",
    `Open: ${link}`
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject: `New message: ${input.subject}`,
        text
      })
    });

    if (!response.ok) {
      return { sent: 0, skipped: false as const, error: `Resend request failed (${response.status}).` };
    }

    return { sent: recipients.length, skipped: false as const };
  } catch (error) {
    return {
      sent: 0,
      skipped: false as const,
      error: error instanceof Error ? error.message : "Unable to send email notifications."
    };
  }
}

