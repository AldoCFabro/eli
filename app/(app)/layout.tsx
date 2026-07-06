import { requireOnboardedSession } from "@/lib/auth/guard";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopBar } from "@/components/layout/TopBar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { business } = await requireOnboardedSession();

  return (
    <div
      className="flex min-h-svh w-full"
      style={
        {
          "--brand-primary": business.brandPrimaryColor,
          "--brand-secondary": business.brandSecondaryColor,
        } as React.CSSProperties
      }
    >
      <Sidebar businessName={business.name} logoUrl={business.logoUrl} />

      <div className="flex min-h-svh flex-1 flex-col">
        <TopBar businessName={business.name} logoUrl={business.logoUrl} />
        <main className="flex-1 px-4 pb-24 pt-4 md:px-8 md:pb-8 md:pt-6">
          <div className="mx-auto w-full max-w-4xl">{children}</div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
