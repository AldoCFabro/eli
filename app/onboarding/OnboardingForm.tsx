"use client";

import { useActionState } from "react";
import { completeOnboardingAction } from "@/app/onboarding/actions";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { fieldError, fieldValue, initialFormState } from "@/lib/action-state";
import { BUSINESS_TYPE_LABELS } from "@/lib/labels";
import { BUSINESS_TYPES } from "@/types";

export function OnboardingForm() {
  const [state, formAction, pending] = useActionState(completeOnboardingAction, initialFormState);
  const resetKey = JSON.stringify(state.values ?? {});

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <FormMessage error={state.error} />

      <Field label="Nombre del negocio" htmlFor="name" error={fieldError(state, "name")}>
        <Input
          id="name"
          name="name"
          placeholder="Ej: Academia Ritmo Latino"
          defaultValue={fieldValue(state, "name")}
          required
        />
      </Field>

      <Field label="Tipo de negocio" htmlFor="type" error={fieldError(state, "type")}>
        <Select key={resetKey} id="type" name="type" defaultValue={fieldValue(state, "type", "academia")} required>
          {BUSINESS_TYPES.map((type) => (
            <option key={type} value={type}>
              {BUSINESS_TYPE_LABELS[type]}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Color primario" htmlFor="brandPrimaryColor" error={fieldError(state, "brandPrimaryColor")}>
          <input
            id="brandPrimaryColor"
            name="brandPrimaryColor"
            type="color"
            defaultValue={fieldValue(state, "brandPrimaryColor", "#4f46e5")}
            className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
          />
        </Field>
        <Field label="Color secundario" htmlFor="brandSecondaryColor" error={fieldError(state, "brandSecondaryColor")}>
          <input
            id="brandSecondaryColor"
            name="brandSecondaryColor"
            type="color"
            defaultValue={fieldValue(state, "brandSecondaryColor", "#14b8a6")}
            className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
          />
        </Field>
      </div>

      <Field label="Logo (opcional)" htmlFor="logo" error={fieldError(state, "logo")} hint="PNG, JPG o WEBP. Máx 3MB.">
        <input
          id="logo"
          name="logo"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium"
        />
      </Field>

      <Field label="Teléfono de contacto" htmlFor="phone" error={fieldError(state, "phone")}>
        <Input id="phone" name="phone" placeholder="Opcional" defaultValue={fieldValue(state, "phone")} />
      </Field>

      <Field label="Dirección" htmlFor="address" error={fieldError(state, "address")}>
        <Textarea
          id="address"
          name="address"
          placeholder="Opcional"
          rows={2}
          defaultValue={fieldValue(state, "address")}
        />
      </Field>

      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Guardando..." : "Terminar configuración"}
      </Button>
    </form>
  );
}
