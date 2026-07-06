import Link from "next/link";
import { requireSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Teacher } from "@/models";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/forms/SearchBar";
import { PlusIcon } from "@/components/ui/icons";
import type { StatusValue } from "@/types";

export default async function TeachersPage({
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

  const teachers = await Teacher.find(filter).sort({ lastName: 1, firstName: 1 }).lean();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Profesores</h1>
        <Link href="/teachers/new">
          <Button size="sm">
            <PlusIcon className="h-4 w-4" /> Nuevo
          </Button>
        </Link>
      </div>

      <SearchBar placeholder="Buscar por nombre o apellido..." />

      {teachers.length === 0 ? (
        <EmptyState
          title={q ? "No encontramos profesores" : "Todavía no cargaste profesores"}
          description={q ? "Probá con otro nombre." : "Creá tu primer profesor para empezar."}
          action={
            !q && (
              <Link href="/teachers/new">
                <Button size="sm">Crear profesor</Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="flex flex-col gap-2">
          {teachers.map((teacher) => (
            <Link key={String(teacher._id)} href={`/teachers/${teacher._id}`}>
              <Card className="flex items-center gap-3 transition hover:border-[var(--brand-primary)] hover:shadow-md">
                <Avatar name={`${teacher.firstName} ${teacher.lastName}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {teacher.firstName} {teacher.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{teacher.phone || "Sin teléfono"}</p>
                </div>
                <Badge status={teacher.status as StatusValue} />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
