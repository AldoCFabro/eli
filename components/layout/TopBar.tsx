import { logoutAction } from "@/app/(auth)/actions";
import { LogoutIcon } from "@/components/ui/icons";

export function TopBar({ businessName, logoUrl }: { businessName: string; logoUrl?: string | null }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:justify-end">
      <div className="flex items-center gap-2 md:hidden">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={businessName} className="h-7 w-7 rounded-md object-cover" />
        ) : (
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold text-white"
            style={{ background: "var(--brand-primary)" }}
          >
            {businessName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="truncate text-sm font-semibold text-slate-900">{businessName}</span>
      </div>

      <form action={logoutAction}>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
        >
          <LogoutIcon className="h-4 w-4" />
          Salir
        </button>
      </form>
    </header>
  );
}
