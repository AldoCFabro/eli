import Link from "next/link";
import { requireSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Student } from "@/models";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/forms/SearchBar";
import { PlusIcon } from "@/components/ui/icons";
import type { StatusValue } from "@/types";

export default async function StudentsPage({
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

  const students = await Student.find(filter).sort({ lastName: 1, firstName: 1 }).lean();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Alumnos</h1>
        <Link href="/students/new">
          <Button size="sm">
            <PlusIcon className="h-4 w-4" /> Nuevo
          </Button>
        </Link>
      </div>

      <SearchBar placeholder="Buscar por nombre o apellido..." />

      {students.length === 0 ? (
        <EmptyState
          title={q ? "No encontramos alumnos" : "Todavía no cargaste alumnos"}
          description={q ? "Probá con otro nombre." : "Creá tu primer alumno para empezar."}
          action={
            !q && (
              <Link href="/students/new">
                <Button size="sm">Crear alumno</Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="flex flex-col gap-2">
          {students.map((student) => (
            <Link key={String(student._id)} href={`/students/${student._id}`}>
              <Card className="flex items-center gap-3 transition hover:border-[var(--brand-primary)] hover:shadow-md">
                <Avatar name={`${student.firstName} ${student.lastName}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{student.phone || "Sin teléfono"}</p>
                </div>
                <Badge status={student.status as StatusValue} />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
