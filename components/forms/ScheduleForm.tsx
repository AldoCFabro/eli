"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { fieldError, fieldValue, fieldValues, initialFormState, type FormState } from "@/lib/action-state";
import { DAY_LABELS_SHORT } from "@/lib/labels";
import { DAYS_OF_WEEK } from "@/types";

type ScheduleFormTextValues = {
  instructorId?: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
};

type ScheduleFormValues = ScheduleFormTextValues & {
  daysOfWeek?: string[];
};

export function ScheduleForm({
  action,
  instructors,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  instructors: { _id: unknown; firstName: string; lastName: string }[];
  defaultValues?: ScheduleFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const v = (field: keyof ScheduleFormTextValues) => fieldValue(state, field, defaultValues?.[field]);
  const selectedDays = new Set(fieldValues(state, "daysOfWeek", defaultValues?.daysOfWeek ?? []));
  const resetKey = JSON.stringify(state.values ?? {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormMessage error={state.error} />

      <Field label="Título (opcional)" htmlFor="title" error={fieldError(state, "title")}>
        <Input id="title" name="title" placeholder="Ej: Turno tarde" defaultValue={v("title")} />
      </Field>

      <Field label="Instructor" htmlFor="instructorId" error={fieldError(state, "instructorId")}>
        <Select key={resetKey} id="instructorId" name="instructorId" defaultValue={v("instructorId")}>
          <option value="">Sin asignar</option>
          {instructors.map((instructor) => (
            <option key={String(instructor._id)} value={String(instructor._id)}>
              {instructor.firstName} {instructor.lastName}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Días" htmlFor="daysOfWeek" error={fieldError(state, "daysOfWeek")}>
        <div key={resetKey} className="flex flex-wrap gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <label
              key={day}
              className="relative flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 has-[:checked]:border-[var(--brand-primary)] has-[:checked]:bg-[var(--brand-primary)]/10 has-[:checked]:text-[var(--brand-primary)]"
            >
              <input
                type="checkbox"
                name="daysOfWeek"
                value={day}
                defaultChecked={selectedDays.has(day)}
                className="sr-only"
              />
              {DAY_LABELS_SHORT[day]}
            </label>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Hora de inicio" htmlFor="startTime" error={fieldError(state, "startTime")}>
          <Input id="startTime" name="startTime" type="time" defaultValue={v("startTime")} required />
        </Field>
        <Field label="Hora de fin" htmlFor="endTime" error={fieldError(state, "endTime")}>
          <Input id="endTime" name="endTime" type="time" defaultValue={v("endTime")} required />
        </Field>
      </div>

      <Field label="Lugar (opcional)" htmlFor="location" error={fieldError(state, "location")}>
        <Input id="location" name="location" placeholder="Ej: Salón 2" defaultValue={v("location")} />
      </Field>

      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
