"use client";

import { useActionState } from "react";
import { updateBusinessSettingsAction } from "@/app/(app)/settings/actions";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { StickyBar } from "@/components/ui/StickyBar";
import { fieldError, initialFormState } from "@/lib/action-state";
import { useDirtyForm } from "@/lib/use-dirty-form";
import { BUSINESS_TYPE_LABELS } from "@/lib/labels";
import { BUSINESS_TYPES, type BusinessType } from "@/types";

type BusinessSettings = {
  name: string;
  type: BusinessType;
  brandPrimaryColor: string;
  brandSecondaryColor: string;
  phone: string;
  address: string;
};

export function SettingsForm({
  business,
  logoUrl,
}: {
  business: BusinessSettings;
  logoUrl: string | null;
}) {
  const [state, formAction, pending] = useActionState(updateBusinessSettingsAction, initialFormState);
  const { values, setField, isDirty } = useDirtyForm({ ...business, type: business.type as string, logoFileName: "" });

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <StickyBar>
        <p className="text-sm text-slate-500">{isDirty ? "Tenés cambios sin guardar." : "Sin cambios."}</p>
        <Button type="submit" disabled={!isDirty || pending} className="ml-auto" size="sm">
          {pending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </StickyBar>

      <FormMessage error={state.error} success={state.success ? "Configuración guardada." : undefined} />

      <Field label="Nombre del negocio" htmlFor="name" error={fieldError(state, "name")}>
        <Input id="name" name="name" value={values.name} onChange={(e) => setField("name", e.target.value)} required />
      </Field>

      <Field label="Tipo de negocio" htmlFor="type" error={fieldError(state, "type")}>
        <Select id="type" name="type" value={values.type} onChange={(e) => setField("type", e.target.value)} required>
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
            value={values.brandPrimaryColor}
            onChange={(e) => setField("brandPrimaryColor", e.target.value)}
            className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
          />
        </Field>
        <Field
          label="Color secundario"
          htmlFor="brandSecondaryColor"
          error={fieldError(state, "brandSecondaryColor")}
        >
          <input
            id="brandSecondaryColor"
            name="brandSecondaryColor"
            type="color"
            value={values.brandSecondaryColor}
            onChange={(e) => setField("brandSecondaryColor", e.target.value)}
            className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
          />
        </Field>
      </div>

      <Field label="Logo" htmlFor="logo" error={fieldError(state, "logo")} hint="PNG, JPG o WEBP. Máx 3MB.">
        <div className="flex items-center gap-3">
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={business.name} className="h-12 w-12 rounded-lg object-cover" />
          )}
          <input
            id="logo"
            name="logo"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setField("logoFileName", e.target.files?.[0]?.name ?? "")}
            className="text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium"
          />
        </div>
      </Field>

      <Field label="Teléfono de contacto" htmlFor="phone" error={fieldError(state, "phone")}>
        <Input id="phone" name="phone" value={values.phone} onChange={(e) => setField("phone", e.target.value)} />
      </Field>

      <Field label="Dirección" htmlFor="address" error={fieldError(state, "address")}>
        <Textarea
          id="address"
          name="address"
          rows={2}
          value={values.address}
          onChange={(e) => setField("address", e.target.value)}
        />
      </Field>
    </form>
  );
}
