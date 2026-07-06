import Link from "next/link";
import { requireSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Instructor } from "@/models";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/forms/SearchBar";
import { PlusIcon } from "@/components/ui/icons";
import type { StatusValue } from "@/types";

export default async function InstructorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const session = await requireSession();
  await connectDB();

  const filter: Record<string, unknown> = { businessId: session.businessId, status: { $ne: "archived" } };
  if (q) {
    const regex = new RegExp(q.trim(), "i");
    filter.$or = [{ firstName: regex }, { lastName: regex }];
  }

  const instructors = await Instructor.find(filter).sort({ lastName: 1, firstName: 1 }).lean();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Instructores</h1>
        <Link href="/instructors/new">
          <Button size="sm">
            <PlusIcon className="h-4 w-4" /> Nuevo
          </Button>
        </Link>
      </div>

      <SearchBar placeholder="Buscar por nombre o apellido..." />

      {instructors.length === 0 ? (
        <EmptyState
          title={q ? "No encontramos instructores" : "Todavía no cargaste instructores"}
          description={q ? "Probá con otro nombre." : "Creá tu primer instructor para empezar."}
          action={
            !q && (
              <Link href="/instructors/new">
                <Button size="sm">Crear instructor</Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="flex flex-col gap-2">
          {instructors.map((instructor) => (
            <Link key={String(instructor._id)} href={`/instructors/${instructor._id}`}>
              <Card className="flex items-center gap-3 transition hover:border-[var(--brand-primary)] hover:shadow-md">
                <Avatar name={`${instructor.firstName} ${instructor.lastName}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {instructor.firstName} {instructor.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{instructor.phone || "Sin teléfono"}</p>
                </div>
                <Badge status={instructor.status as StatusValue} />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
