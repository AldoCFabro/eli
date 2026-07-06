"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { StickyBar } from "@/components/ui/StickyBar";
import { fieldError, initialFormState, type FormState } from "@/lib/action-state";
import { useDirtyForm } from "@/lib/use-dirty-form";
import { SEX_LABELS } from "@/lib/labels";
import { DOCUMENT_TYPES, SEX_VALUES } from "@/types";

type TeacherFormValues = {
  firstName: string;
  lastName: string;
  birthDate: string;
  documentType: string;
  documentNumber: string;
  phone: string;
  address: string;
  sex: string;
  notes: string;
};

const EMPTY_VALUES: TeacherFormValues = {
  firstName: "",
  lastName: "",
  birthDate: "",
  documentType: "DNI",
  documentNumber: "",
  phone: "",
  address: "",
  sex: "otro",
  notes: "",
};

export function TeacherForm({
  action,
  initialValues,
  submitLabel,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  initialValues?: Partial<TeacherFormValues>;
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

      <div className="grid grid-cols-2 gap-3">
        <Field label="Nombre" htmlFor="firstName" error={fieldError(state, "firstName")}>
          <Input
            id="firstName"
            name="firstName"
            value={values.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
            required
          />
        </Field>
        <Field label="Apellido" htmlFor="lastName" error={fieldError(state, "lastName")}>
          <Input
            id="lastName"
            name="lastName"
            value={values.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
            required
          />
        </Field>
      </div>

      <Field label="Fecha de nacimiento" htmlFor="birthDate" error={fieldError(state, "birthDate")}>
        <Input
          id="birthDate"
          name="birthDate"
          type="date"
          value={values.birthDate}
          onChange={(e) => setField("birthDate", e.target.value)}
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Tipo de documento" htmlFor="documentType" error={fieldError(state, "documentType")}>
          <Select
            id="documentType"
            name="documentType"
            value={values.documentType}
            onChange={(e) => setField("documentType", e.target.value)}
          >
            {DOCUMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Número de documento" htmlFor="documentNumber" error={fieldError(state, "documentNumber")}>
          <Input
            id="documentNumber"
            name="documentNumber"
            value={values.documentNumber}
            onChange={(e) => setField("documentNumber", e.target.value)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Teléfono" htmlFor="phone" error={fieldError(state, "phone")}>
          <Input id="phone" name="phone" value={values.phone} onChange={(e) => setField("phone", e.target.value)} />
        </Field>
        <Field label="Sexo" htmlFor="sex" error={fieldError(state, "sex")}>
          <Select id="sex" name="sex" value={values.sex} onChange={(e) => setField("sex", e.target.value)}>
            {SEX_VALUES.map((value) => (
              <option key={value} value={value}>
                {SEX_LABELS[value]}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Dirección" htmlFor="address" error={fieldError(state, "address")}>
        <Input
          id="address"
          name="address"
          value={values.address}
          onChange={(e) => setField("address", e.target.value)}
        />
      </Field>

      <Field label="Notas" htmlFor="notes" error={fieldError(state, "notes")}>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          value={values.notes}
          onChange={(e) => setField("notes", e.target.value)}
        />
      </Field>
    </form>
  );
}
