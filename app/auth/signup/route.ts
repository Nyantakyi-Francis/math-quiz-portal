import { redirect } from "next/navigation";
import { normalizeAppPath } from "@/lib/auth/redirect";
import { getSiteUrl } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSafeAuthError } from "@/lib/errors/user-facing";
import { TERMS_VERSION } from "@/lib/legal/terms";

export async function POST(request: Request) {
  const formData = await request.formData();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const termsAccepted = formData.get("terms") === "accepted";
  const next = normalizeAppPath("/dashboard");

  if (!termsAccepted) {
    redirect(`/signup?error=${encodeURIComponent("Please agree to the Terms of Service before creating an account.")}`);
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect(`/signup?error=${encodeURIComponent("Account creation is temporarily unavailable. Please try again later.")}`);
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        terms_accepted_at: new Date().toISOString(),
        terms_version: TERMS_VERSION
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
