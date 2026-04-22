import { redirect } from "next/navigation";
import { normalizeAppPath } from "@/lib/auth/redirect";
import { getSiteUrl } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = normalizeAppPath("/dashboard");

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect(`/signup?error=${encodeURIComponent("Supabase is not configured yet.")}`);
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
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `/signup?success=${encodeURIComponent(
      "Account created. Check your email for the confirmation link."
    )}`
  );
}
