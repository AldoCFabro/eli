import type { z } from "zod";

export type SubmittedValues = Record<string, string | string[]>;

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
  values?: SubmittedValues;
};

export const initialFormState: FormState = {};

/**
 * React resets uncontrolled form fields whenever a form action returns
 * (even when it just returns validation errors, not only on true success).
 * We echo the submitted values back so components can re-populate the
 * fields React just wiped, instead of the user losing everything they typed.
 */
export function serializeFormInput(
  input: Record<string, unknown>,
  omit: string[] = []
): SubmittedValues {
  const values: SubmittedValues = {};
  for (const [key, value] of Object.entries(input)) {
    if (omit.includes(key)) continue;
    if (value instanceof File) continue;
    if (Array.isArray(value)) values[key] = value.map(String);
    else if (value != null) values[key] = String(value);
  }
  return values;
}

export function zodErrorState(
  error: z.ZodError,
  rawInput?: Record<string, unknown>,
  omit: string[] = []
): FormState {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] ? String(issue.path[0]) : "_form";
    fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
  }
  return {
    fieldErrors,
    values: rawInput ? serializeFormInput(rawInput, omit) : undefined,
  };
}

export function fieldError(state: FormState | undefined, field: string) {
  return state?.fieldErrors?.[field]?.[0];
}

export function fieldValue(state: FormState | undefined, field: string, fallback?: string) {
  const value = state?.values?.[field];
  if (typeof value === "string") return value;
  return fallback ?? "";
}

export function fieldValues(state: FormState | undefined, field: string, fallback: string[] = []) {
  const value = state?.values?.[field];
  if (Array.isArray(value)) return value;
  return fallback;
}
