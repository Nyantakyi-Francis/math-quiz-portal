function normalizeSiteUrl(url: string) {
  return url.trim().replace(/\/+$/, "");
}

export function getConfiguredSiteUrl() {
  return normalizeSiteUrl(
    process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  );
}
