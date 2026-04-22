import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
      error: "Supabase is not configured yet."
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
      error: profileError.message
    });
  }

  if (profile?.role === "admin") {
    return redirectWithStatus(request.url, {
      error: "Admins should use the admin console to send messages."
    });
  }

  const formData = await request.formData();
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!subject || !body) {
    return redirectWithStatus(request.url, {
      error: "Subject and message body are required."
    });
  }

  const { data: admins, error: adminsError } = await admin
    .from("profiles")
    .select("id")
    .eq("role", "admin");

  if (adminsError) {
    return redirectWithStatus(request.url, {
      error: adminsError.message
    });
  }

  const recipientIds = (admins ?? []).map((entry) => entry.id);

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
      error: messageError?.message ?? "Unable to create your message."
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
      error: recipientsError.message
    });
  }

  return redirectWithStatus(request.url, {
    sent: String(recipientIds.length)
  });
}
