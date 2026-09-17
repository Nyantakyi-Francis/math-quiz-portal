import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requiredTextField } from "@/lib/http/validation";
import { getSafeActionError } from "@/lib/errors/user-facing";

const validRoles = new Set(["learner", "admin"]);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function redirectWithStatus(requestUrl: string, params: Record<string, string>) {
  const url = new URL("/admin", requestUrl);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return NextResponse.redirect(url);
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return redirectWithStatus(request.url, {
      error: getSafeActionError()
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

  const { data: currentProfile, error: currentProfileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (currentProfileError || currentProfile?.role !== "admin") {
    return redirectWithStatus(request.url, {
      error: "Only an administrator can change account roles."
    });
  }

  const formData = await request.formData();
  const profileIdResult = requiredTextField(formData, "profile_id", "Profile", {
    maxLength: 64
  });
  const roleResult = requiredTextField(formData, "role", "Role", {
    maxLength: 16
  });

  if (!profileIdResult.ok) {
    return redirectWithStatus(request.url, { error: profileIdResult.error });
  }

  if (!roleResult.ok) {
    return redirectWithStatus(request.url, { error: roleResult.error });
  }

  const profileId = profileIdResult.value.trim();
  const nextRole = roleResult.value.trim();

  if (!uuidPattern.test(profileId) || !validRoles.has(nextRole)) {
    return redirectWithStatus(request.url, {
      error: "Choose a valid learner and role."
    });
  }

  if (profileId === user.id && nextRole !== "admin") {
    return redirectWithStatus(request.url, {
      error: "You cannot remove your own administrator access."
    });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: nextRole })
    .eq("id", profileId);

  if (error) {
    return redirectWithStatus(request.url, {
      error: getSafeActionError()
    });
  }

  return redirectWithStatus(request.url, {
    roleUpdated: "1"
  });
}
