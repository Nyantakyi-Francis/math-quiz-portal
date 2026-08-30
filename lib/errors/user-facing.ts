const AUTH_ERROR_MESSAGES: Array<[RegExp, string]> = [
  [/invalid login credentials/i, "The email or password is incorrect."],
  [/email not confirmed/i, "Confirm your email address before signing in."],
  [/user already registered/i, "An account already exists for this email address."],
  [/password should be at least/i, "Choose a password with at least 6 characters."],
  [/rate limit|too many requests/i, "Too many attempts. Please wait a moment and try again."]
];

export function getSafeAuthError(message: string) {
  return (
    AUTH_ERROR_MESSAGES.find(([pattern]) => pattern.test(message))?.[1] ??
    "We could not complete that request. Please try again."
  );
}

export function getSafeDataError() {
  return "We could not load this information. Please try again shortly.";
}

export function getSafeActionError() {
  return "We could not complete that action. Please try again.";
}
