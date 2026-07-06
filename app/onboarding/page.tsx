import { redirect } from "next/navigation";
import { requireExistingBusiness, requireSession } from "@/lib/auth/guard";
import { OnboardingForm } from "@/app/onboarding/OnboardingForm";

export default async function OnboardingPage() {
  const session = await requireSession();
  const business = await requireExistingBusiness(session);

  if (business.onboardingCompleted) redirect("/dashboard");

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-lg flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Configurá tu negocio</h1>
        <p className="mt-1 text-sm text-slate-500">
          Esto te va a tomar menos de un minuto. Podés editarlo después desde Configuración.
        </p>
      </div>
      <OnboardingForm />
    </div>
  );
}
