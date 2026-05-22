import { NextResponse } from "next/server";
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

  if (!supabase) {
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

  const formData = await request.formData();
  const studentResult = requiredTextField(formData, "student_id", "Student", {
    maxLength: 64
  });

  if (!studentResult.ok) {
    const url = new URL("/students", request.url);
    url.searchParams.set("error", studentResult.error);
    return NextResponse.redirect(url);
  }

  const studentId = studentResult.value.trim();

  const { data: unreadRows, error: unreadError } = await supabase
    .from("message_recipients")
    .select("message_id, messages(sender_id, message_type)")
    .eq("recipient_id", user.id)
    .is("read_at", null)
    .eq("messages.message_type", "peer")
    .eq("messages.sender_id", studentId)
    .limit(500);

  if (unreadError) {
    return redirectWithStatus(request.url, studentId, {
      error: unreadError.message
    });
  }

  const messageIds = (unreadRows ?? [])
    .map((row: any) => row.message_id)
    .filter((messageId: any): messageId is string => typeof messageId === "string" && Boolean(messageId));

  if (!messageIds.length) {
    return redirectWithStatus(request.url, studentId, {
      marked: "1"
    });
  }

  const { error: updateError } = await supabase
    .from("message_recipients")
    .update({
      read_at: new Date().toISOString()
    })
    .eq("recipient_id", user.id)
    .in("message_id", messageIds)
    .is("read_at", null);

  if (updateError) {
    return redirectWithStatus(request.url, studentId, {
      error: updateError.message
    });
  }

  return redirectWithStatus(request.url, studentId, {
    marked: "1"
  });
}

