import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function redirectWithStatus(requestUrl: string, params: Record<string, string>) {
  const url = new URL("/admin", requestUrl);

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
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const messageType = String(formData.get("message_type") ?? "announcement").trim();

  if (!subject || !body) {
    return redirectWithStatus(request.url, {
      error: "Subject and message body are required."
    });
  }

  if (!["admin", "announcement"].includes(messageType)) {
    return redirectWithStatus(request.url, {
      error: "Invalid message type selected."
    });
  }

  let recipientIds: string[] = [];

  if (audience === "single") {
    if (!recipientId) {
      return redirectWithStatus(request.url, {
        error: "Choose a learner before sending a direct message."
      });
    }

    const { data: learner, error: learnerError } = await admin
      .from("profiles")
      .select("id")
      .eq("id", recipientId)
      .eq("role", "learner")
      .maybeSingle();

    if (learnerError || !learner) {
      return redirectWithStatus(request.url, {
        error: "That learner could not be found."
      });
    }

    recipientIds = [learner.id];
  } else {
    const { data: learners, error: learnersError } = await admin
      .from("profiles")
      .select("id")
      .eq("role", "learner");

    if (learnersError) {
      return redirectWithStatus(request.url, {
        error: learnersError.message
      });
    }

    recipientIds = (learners ?? []).map((learner) => learner.id);
  }

  if (!recipientIds.length) {
    return redirectWithStatus(request.url, {
      error: "No learners are available for that message."
    });
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
    });
  }

  const recipientRows = recipientIds.map((id) => ({
    message_id: message.id,
    recipient_id: id
  }));

  const { error: recipientError } = await admin.from("message_recipients").insert(recipientRows);

  if (recipientError) {
    return redirectWithStatus(request.url, {
      error: recipientError.message
    });
  }

  return redirectWithStatus(request.url, {
    sent: String(recipientIds.length)
  });
}
