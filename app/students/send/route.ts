import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requiredTextField } from "@/lib/http/validation";

function redirectWithStatus(requestUrl: string, studentId: string, params: Record<string, string>) {
  const url = new URL("/students", requestUrl);
  url.searchParams.set("student", studentId);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return NextResponse.redirect(url);
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  if (!supabase || !admin) {
    const url = new URL("/students", request.url);
    url.searchParams.set("error", "Supabase is not configured yet.");
    return NextResponse.redirect(url);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", "/students");
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    const url = new URL("/students", request.url);
    url.searchParams.set("error", profileError.message);
    return NextResponse.redirect(url);
  }

  if (profile?.role === "admin") {
    const url = new URL("/students", request.url);
    url.searchParams.set("error", "Admins should use the admin console for messaging.");
    return NextResponse.redirect(url);
  }

  const formData = await request.formData();
  const recipientResult = requiredTextField(formData, "recipient_id", "Recipient", {
    maxLength: 64
  });
  const subjectResult = requiredTextField(formData, "subject", "Subject", {
    maxLength: 160
  });
  const bodyResult = requiredTextField(formData, "body", "Message body", {
    maxLength: 4000
  });

  if (!recipientResult.ok) {
    const url = new URL("/students", request.url);
    url.searchParams.set("error", recipientResult.error);
    return NextResponse.redirect(url);
  }

  if (!subjectResult.ok) {
    return redirectWithStatus(request.url, recipientResult.value, {
      error: subjectResult.error
    });
  }

  if (!bodyResult.ok) {
    return redirectWithStatus(request.url, recipientResult.value, {
      error: bodyResult.error
    });
  }

  const recipientId = recipientResult.value.trim();

  if (recipientId === user.id) {
    return redirectWithStatus(request.url, recipientId, {
      error: "You cannot message yourself."
    });
  }

  const { data: recipient, error: recipientError } = await admin
    .from("directory_profiles")
    .select("id")
    .eq("id", recipientId)
    .maybeSingle();

  if (recipientError) {
    return redirectWithStatus(request.url, recipientId, {
      error: recipientError.message
    });
  }

  if (!recipient?.id) {
    return redirectWithStatus(request.url, recipientId, {
      error: "That student is not available for messaging."
    });
  }

  const { data: message, error: messageError } = await admin
    .from("messages")
    .insert({
      sender_id: user.id,
      subject: subjectResult.value,
      body: bodyResult.value,
      message_type: "peer"
    })
    .select("id")
    .single();

  if (messageError || !message) {
    return redirectWithStatus(request.url, recipientId, {
      error: messageError?.message ?? "Unable to create your message."
    });
  }

  const { error: recipientsError } = await admin.from("message_recipients").insert({
    message_id: message.id,
    recipient_id: recipientId
  });

  if (recipientsError) {
    return redirectWithStatus(request.url, recipientId, {
      error: recipientsError.message
    });
  }

  return redirectWithStatus(request.url, recipientId, {
    sent: "1"
  });
}

