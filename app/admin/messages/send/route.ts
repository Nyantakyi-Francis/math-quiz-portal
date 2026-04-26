import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notifyMessageRecipientsByEmail } from "@/lib/email/notifications";
import { isUuid, requiredTextField } from "@/lib/http/validation";

type LearnerRecipientRow = {
  id: string;
  email: string | null;
  full_name: string | null;
};

function getReturnTo(requestUrl: string, value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value, requestUrl);

    if (url.origin !== new URL(requestUrl).origin) {
      return null;
    }

    if (!url.pathname.startsWith("/admin/messages")) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

function redirectWithStatus(requestUrl: string, params: Record<string, string>, returnTo?: URL | null) {
  const url = returnTo ?? new URL("/admin", requestUrl);

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
      error: "Supabase is not configured yet."
    });
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", "/admin");
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || profile?.role !== "admin") {
    return redirectWithStatus(request.url, {
      error: "Only admin accounts can send messages."
    });
  }

  const formData = await request.formData();
  const audience = String(formData.get("audience") ?? "all");
  const recipientId = String(formData.get("recipient_id") ?? "").trim();
  const subjectInput = String(formData.get("subject") ?? "").trim().slice(0, 160);
  const bodyResult = requiredTextField(formData, "body", "Message body", {
    maxLength: 4000
  });
  const messageType = String(formData.get("message_type") ?? "announcement").trim();
  const returnTo = getReturnTo(request.url, formData.get("return_to")?.toString() ?? null);

  const subject =
    subjectInput ||
    (audience === "single" && returnTo ? "Chat message" : "");

  if (!subject) {
    return redirectWithStatus(request.url, {
      error: "Subject is required."
    }, returnTo);
  }

  if (!bodyResult.ok) {
    return redirectWithStatus(request.url, {
      error: bodyResult.error
    }, returnTo);
  }

  const body = bodyResult.value;

  if (!["admin", "announcement"].includes(messageType)) {
    return redirectWithStatus(request.url, {
      error: "Invalid message type selected."
    }, returnTo);
  }

  let recipientIds: string[] = [];
  let recipientsForEmail: { email: string; name?: string | null }[] = [];

  if (audience === "single") {
    if (!recipientId || !isUuid(recipientId)) {
      return redirectWithStatus(request.url, {
        error: "Choose a valid learner before sending a direct message."
      }, returnTo);
    }

    const { data: learner, error: learnerError } = await admin
      .from("profiles")
      .select("id, email, full_name")
      .eq("id", recipientId)
      .eq("role", "learner")
      .maybeSingle();

    if (learnerError || !learner) {
      return redirectWithStatus(request.url, {
        error: "That learner could not be found."
      }, returnTo);
    }

    recipientIds = [learner.id];
    if (learner.email) {
      recipientsForEmail = [{ email: learner.email, name: learner.full_name ?? null }];
    }
  } else {
    const { data: learners, error: learnersError } = await admin
      .from("profiles")
      .select("id, email, full_name")
      .eq("role", "learner");

    if (learnersError) {
      return redirectWithStatus(request.url, {
        error: learnersError.message
      }, returnTo);
    }

    const learnerRows = (learners ?? []) as LearnerRecipientRow[];
    recipientIds = learnerRows.map((learner) => learner.id);
    recipientsForEmail = learnerRows
      .map((learner) => ({
        email: String(learner.email ?? "").trim(),
        name: learner.full_name ?? null
      }))
      .filter((recipient) => Boolean(recipient.email));
  }

  if (!recipientIds.length) {
    return redirectWithStatus(request.url, {
      error: "No learners are available for that message."
    }, returnTo);
  }

  const { data: message, error: messageError } = await admin
    .from("messages")
    .insert({
      sender_id: user.id,
      subject,
      body,
      message_type: messageType
    })
    .select("id")
    .single();

  if (messageError || !message) {
    return redirectWithStatus(request.url, {
      error: messageError?.message ?? "Unable to create the message."
    }, returnTo);
  }

  const recipientRows = recipientIds.map((id) => ({
    message_id: message.id,
    recipient_id: id
  }));

  const { error: recipientError } = await admin.from("message_recipients").insert(recipientRows);

  if (recipientError) {
    return redirectWithStatus(request.url, {
      error: recipientError.message
    }, returnTo);
  }

  // Optional email notifications (guarded by env vars and recipient cap).
  await notifyMessageRecipientsByEmail({
    request,
    recipients: recipientsForEmail,
    senderLabel: user.email ?? "Admin",
    subject,
    body,
    linkPath: "/messages"
  });

  return redirectWithStatus(request.url, {
    sent: String(recipientIds.length)
  }, returnTo);
}
