import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isUuid } from "@/lib/http/validation";
import { getSafeActionError } from "@/lib/errors/user-facing";

type MessageRecipientIdRow = {
  id: string;
};

function wantsHtml(request: Request) {
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("text/html");
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    if (!wantsHtml(request)) {
      return NextResponse.json({ ok: false, error: getSafeActionError() }, { status: 503 });
    }

    const url = new URL("/admin/messages", request.url);
    url.searchParams.set("error", getSafeActionError());
    return NextResponse.redirect(url);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    if (!wantsHtml(request)) {
      return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", "/admin/messages");
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    if (!wantsHtml(request)) {
      return NextResponse.json({ ok: false, error: "Only admins can mark threads as read." }, { status: 403 });
    }

    const url = new URL("/admin/messages", request.url);
    url.searchParams.set("error", "Only admins can mark threads as read.");
    return NextResponse.redirect(url);
  }

  const contentType = request.headers.get("content-type") ?? "";
  let learnerId = "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const body = await request.text();
    learnerId = String(new URLSearchParams(body).get("learner_id") ?? "").trim();
  } else if (contentType.includes("multipart/form-data")) {
    learnerId = String((await request.formData()).get("learner_id") ?? "").trim();
  }

  if (!learnerId || !isUuid(learnerId)) {
    if (!wantsHtml(request)) {
      return NextResponse.json({ ok: false, error: "Invalid learner_id." }, { status: 400 });
    }

    const url = new URL("/admin/messages", request.url);
    url.searchParams.set("error", "Choose a valid learner to mark as read.");
    return NextResponse.redirect(url);
  }

  const { data: unreadRows, error: unreadError } = await supabase
    .from("message_recipients")
    .select("id, messages(sender_id, message_type)")
    .eq("recipient_id", user.id)
    .is("read_at", null)
    .eq("messages.sender_id", learnerId)
    .eq("messages.message_type", "admin");

  if (unreadError) {
    if (!wantsHtml(request)) {
      return NextResponse.json({ ok: false, error: getSafeActionError() }, { status: 500 });
    }

    const url = new URL(`/admin/messages?learner=${learnerId}`, request.url);
    console.error("Unable to load unread messages:", unreadError.message);
    url.searchParams.set("error", getSafeActionError());
    return NextResponse.redirect(url);
  }

  const ids = ((unreadRows ?? []) as MessageRecipientIdRow[]).map((row) => row.id).filter(Boolean);

  if (ids.length) {
    const { error: updateError } = await supabase
      .from("message_recipients")
      .update({ read_at: new Date().toISOString() })
      .in("id", ids);

    if (updateError) {
      if (!wantsHtml(request)) {
        return NextResponse.json({ ok: false, error: getSafeActionError() }, { status: 500 });
      }

      const url = new URL(`/admin/messages?learner=${learnerId}`, request.url);
      console.error("Unable to mark the message thread as read:", updateError.message);
      url.searchParams.set("error", getSafeActionError());
      return NextResponse.redirect(url);
    }
  }

  if (!wantsHtml(request)) {
    return NextResponse.json({ ok: true, marked: ids.length });
  }

  return NextResponse.redirect(new URL(`/admin/messages?learner=${learnerId}`, request.url));
}
