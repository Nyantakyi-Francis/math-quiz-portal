import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notifyMessageRecipientsByEmail } from "@/lib/email/notifications";
import { requiredTextField } from "@/lib/http/validation";
import { getSafeActionError } from "@/lib/errors/user-facing";

type AdminRecipientRow = {
  id: string;
  email: string | null;
  full_name: string | null;
};

function redirectWithStatus(requestUrl: string, params: Record<string, string>) {
  const url = new URL("/messages", requestUrl);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return NextResponse.redirect(url);
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  if (!supabase || !admin) {
    return redirectWithStatus(request.url, {
      error: getSafeActionError()
    });
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", "/messages");
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return redirectWithStatus(request.url, {
      error: getSafeActionError()
    });
  }

  if (profile?.role === "admin") {
    return redirectWithStatus(request.url, {
      error: "Admins should use the admin console to send messages."
    });
  }

  const { data: senderProfile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const formData = await request.formData();
  const subjectResult = requiredTextField(formData, "subject", "Subject", {
    maxLength: 160
  });
  const bodyResult = requiredTextField(formData, "body", "Message body", {
    maxLength: 4000
  });

  if (!subjectResult.ok) {
    return redirectWithStatus(request.url, {
      error: subjectResult.error
    });
  }

  if (!bodyResult.ok) {
    return redirectWithStatus(request.url, {
      error: bodyResult.error
    });
  }

  const subject = subjectResult.value;
  const body = bodyResult.value;

  const { data: admins, error: adminsError } = await admin
    .from("profiles")
    .select("id, email, full_name")
    .eq("role", "admin");

  if (adminsError) {
    return redirectWithStatus(request.url, {
      error: getSafeActionError()
    });
  }

  const adminRows = (admins ?? []) as AdminRecipientRow[];
  const recipientIds = adminRows.map((entry) => entry.id);
  const recipientsForEmail = adminRows
    .map((entry) => ({
      email: String(entry.email ?? "").trim(),
      name: entry.full_name ?? null
    }))
    .filter((recipient) => Boolean(recipient.email));

  if (!recipientIds.length) {
    return redirectWithStatus(request.url, {
      error: "No admin account is available to receive your message yet."
    });
  }

  const { data: message, error: messageError } = await admin
    .from("messages")
    .insert({
      sender_id: user.id,
      subject,
      body,
      message_type: "admin"
    })
    .select("id")
    .single();

  if (messageError || !message) {
    return redirectWithStatus(request.url, {
      error: getSafeActionError()
    });
  }

  const { error: recipientsError } = await admin.from("message_recipients").insert(
    recipientIds.map((recipientId) => ({
      message_id: message.id,
      recipient_id: recipientId
    }))
  );

  if (recipientsError) {
    return redirectWithStatus(request.url, {
      error: getSafeActionError()
    });
  }

  await notifyMessageRecipientsByEmail({
    request,
    recipients: recipientsForEmail,
    senderLabel: senderProfile?.full_name ?? user.email ?? "Learner",
    subject,
    body,
    linkPath: `/admin/messages?learner=${user.id}`
  });

  return redirectWithStatus(request.url, {
    sent: String(recipientIds.length)
  });
}
