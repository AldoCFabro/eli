"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { fieldError, fieldValue, initialFormState } from "@/lib/action-state";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialFormState);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-slate-500">Entrá para gestionar tu negocio.</p>
      </div>

      <form action={formAction} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <FormMessage error={state.error} />

        <Field label="Email" htmlFor="email" error={fieldError(state, "email")}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={fieldValue(state, "email")}
            required
          />
        </Field>

        <Field label="Contraseña" htmlFor="password" error={fieldError(state, "password")}>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </Field>

        <Button type="submit" disabled={pending} className="mt-2 w-full">
          {pending ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500">
        ¿No tenés cuenta?{" "}
        <Link href="/register" className="font-medium text-[var(--brand-primary)]">
          Registrate
        </Link>
      </p>
    </div>
  );
}
