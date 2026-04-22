export function normalizeAppPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/")) {
    return "/dashboard";
  }

  if (value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}
