import { redirect } from "next/navigation";
import { normalizeAppPath } from "@/lib/auth/redirect";
import { getSiteUrl } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSafeAuthError } from "@/lib/errors/user-facing";

export async function POST(request: Request) {
  const formData = await request.formData();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = normalizeAppPath("/dashboard");

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect(`/signup?error=${encodeURIComponent("Account creation is temporarily unavailable. Please try again later.")}`);
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      },
      emailRedirectTo: `${getSiteUrl(request)}/auth/callback?next=${encodeURIComponent(next)}`
    }
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(getSafeAuthError(error.message))}`);
  }

  redirect(
    `/signup?success=${encodeURIComponent(
      "Account created. Check your email for the confirmation link."
    )}`
  );
}
