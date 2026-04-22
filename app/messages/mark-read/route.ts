import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    const url = new URL("/messages", request.url);
    url.searchParams.set("error", "Supabase is not configured yet.");
    return NextResponse.redirect(url);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", "/messages");
    return NextResponse.redirect(loginUrl);
  }

  const { error } = await supabase
    .from("message_recipients")
    .update({
      read_at: new Date().toISOString()
    })
    .eq("recipient_id", user.id)
    .is("read_at", null);

  const url = new URL("/messages", request.url);

  if (error) {
    url.searchParams.set("error", error.message);
  } else {
    url.searchParams.set("marked", "1");
  }

  return NextResponse.redirect(url);
}
