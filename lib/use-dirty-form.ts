import { useMemo, useState } from "react";

export function useDirtyForm<T extends Record<string, unknown>>(initial: T) {
  const [values, setValues] = useState<T>(initial);
  const isDirty = useMemo(() => JSON.stringify(values) !== JSON.stringify(initial), [values, initial]);

  function setField<K extends keyof T>(key: K, value: T[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return { values, setField, setValues, isDirty };
}
