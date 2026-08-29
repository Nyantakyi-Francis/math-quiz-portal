import { NextResponse, type NextRequest } from "next/server";
import { normalizeAppPath } from "@/lib/auth/redirect";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { updateSession } from "@/lib/supabase/middleware";

const protectedPrefixes = [
  "/dashboard",
  "/messages",
  "/modules",
  "/resources",
  "/students",
  "/admin"
];
const authPages = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { isConfigured } = getSupabaseEnv();
  const { response, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  if (!isConfigured) {
    return response;
  }

  const isProtectedRoute = protectedPrefixes.some((prefix) => path.startsWith(prefix));
  const isAuthPage = authPages.some((prefix) => path.startsWith(prefix));

  if (isProtectedRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "next",
      normalizeAppPath(`${path}${request.nextUrl.search}`)
    );
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
