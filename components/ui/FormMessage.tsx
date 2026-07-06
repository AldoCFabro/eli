export function FormMessage({ error, success }: { error?: string; success?: string }) {
  if (!error && !success) return null;
  return (
    <p
      role="alert"
      aria-live="polite"
      className={
        error
          ? "rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700"
          : "rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
      }
    >
      {error ?? success}
    </p>
  );
}
