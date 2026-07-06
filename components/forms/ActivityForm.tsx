"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { StickyBar } from "@/components/ui/StickyBar";
import { fieldError, initialFormState, type FormState } from "@/lib/action-state";
import { useDirtyForm } from "@/lib/use-dirty-form";

type ActivityFormValues = { name: string; description: string };

const EMPTY_VALUES: ActivityFormValues = { name: "", description: "" };

export function ActivityForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  initialValues?: Partial<ActivityFormValues>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const { values, setField, isDirty } = useDirtyForm({ ...EMPTY_VALUES, ...initialValues });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <StickyBar>
        <p className="text-sm text-slate-500">{isDirty ? "Tenés cambios sin guardar." : "Sin cambios."}</p>
        <Button type="submit" disabled={!isDirty || pending} className="ml-auto" size="sm">
          {pending ? "Guardando..." : submitLabel}
        </Button>
      </StickyBar>

      <FormMessage error={state.error} success={state.success ? "Cambios guardados." : undefined} />

      <Field label="Nombre" htmlFor="name" error={fieldError(state, "name")}>
        <Input
          id="name"
          name="name"
          placeholder="Ej: Zumba"
          value={values.name}
          onChange={(e) => setField("name", e.target.value)}
          required
        />
      </Field>

      <Field label="Descripción" htmlFor="description" error={fieldError(state, "description")}>
        <Textarea
          id="description"
          name="description"
          rows={3}
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
        />
      </Field>
    </form>
  );
}
