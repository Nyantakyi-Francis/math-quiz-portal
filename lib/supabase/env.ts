function normalizeSupabaseUrl(url: string) {
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

function normalizeSiteUrl(url: string) {
  return url.trim().replace(/\/$/, "");
}

function normalizeVercelHost(host: string) {
  return host.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function isLocalSiteUrl(url: string) {
  return /^https?:\/\/(localhost|127(?:\.\d{1,3}){3})(:\d+)?$/i.test(url);
}

function getRequestOrigin(request?: Request) {
  if (!request) {
    return "";
  }

  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();

  if (forwardedHost) {
    const forwardedProto =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
      url.protocol.replace(":", "") ||
      "https";

    return normalizeSiteUrl(`${forwardedProto}://${forwardedHost}`);
  }

  return normalizeSiteUrl(url.origin);
}

export function getSupabaseEnv() {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  return {
    url,
    anonKey,
    serviceRoleKey,
    isConfigured: Boolean(url && anonKey)
  };
}

export function getSiteUrl(request?: Request) {
  const requestOrigin = getRequestOrigin(request);

  if (requestOrigin) {
    return requestOrigin;
  }

  const explicitSiteUrl = normalizeSiteUrl(
    process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? ""
  );
  const vercelHost = normalizeVercelHost(
    process.env.VERCEL_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL ?? ""
  );

  // Ignore a local-only URL when the app is running in Vercel.
  if (explicitSiteUrl && !(vercelHost && isLocalSiteUrl(explicitSiteUrl))) {
    return explicitSiteUrl;
  }

  if (vercelHost) {
    return `https://${vercelHost}`;
  }

  return "http://localhost:3000";
}
