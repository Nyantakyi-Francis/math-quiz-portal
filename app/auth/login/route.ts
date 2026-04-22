import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeAppPath } from "@/lib/auth/redirect";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = normalizeAppPath(String(formData.get("next") ?? "/dashboard"));

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect(`/login?error=${encodeURIComponent("Supabase is not configured yet.")}`);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`
    );
  }

  redirect(next);
}
