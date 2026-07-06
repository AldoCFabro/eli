import { requireOnboardedSession } from "@/lib/auth/guard";
import { logoutAction } from "@/app/(auth)/actions";
import { SettingsForm } from "@/app/(app)/settings/SettingsForm";
import { Button } from "@/components/ui/Button";

export default async function SettingsPage() {
  const { business } = await requireOnboardedSession();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-900">Configuración</h1>

      <SettingsForm
        business={{
          name: business.name,
          type: business.type,
          brandPrimaryColor: business.brandPrimaryColor,
          brandSecondaryColor: business.brandSecondaryColor,
          phone: business.phone,
          address: business.address,
        }}
        logoUrl={business.logoUrl}
      />

      <form action={logoutAction}>
        <Button type="submit" variant="ghost" size="sm">
          Cerrar sesión
        </Button>
      </form>
    </div>
  );
}
