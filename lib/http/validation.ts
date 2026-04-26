export type ValidationResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: string;
    };

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string) {
  return uuidPattern.test(value);
}

export async function readJsonBody<T>(
  request: Request,
  validate: (value: unknown) => ValidationResult<T>
): Promise<ValidationResult<T>> {
  try {
    return validate(await request.json());
  } catch {
    return {
      ok: false,
      error: "Request body must be valid JSON."
    };
  }
}

export function requiredTextField(
  formData: FormData,
  key: string,
  label: string,
  options: { maxLength?: number } = {}
): ValidationResult<string> {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) {
    return {
      ok: false,
      error: `${label} is required.`
    };
  }

  if (options.maxLength && value.length > options.maxLength) {
    return {
      ok: false,
      error: `${label} must be ${options.maxLength} characters or fewer.`
    };
  }

  return {
    ok: true,
    value
  };
}
