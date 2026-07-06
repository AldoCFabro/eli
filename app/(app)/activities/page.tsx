import Link from "next/link";
import { requireOnboardedSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Activity } from "@/models";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/forms/SearchBar";
import { PlusIcon } from "@/components/ui/icons";
import type { StatusValue } from "@/types";

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { session } = await requireOnboardedSession();
  await connectDB();

  const filter: Record<string, unknown> = { businessId: session.businessId, status: { $ne: "archived" } };
  if (q) filter.name = new RegExp(q.trim(), "i");

  const activities = await Activity.find(filter).sort({ name: 1 }).lean();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Disciplinas</h1>
        <Link href="/activities/new">
          <Button size="sm">
            <PlusIcon className="h-4 w-4" /> Nueva
          </Button>
        </Link>
      </div>

      <SearchBar placeholder="Buscar disciplina..." />

      {activities.length === 0 ? (
        <EmptyState
          title={q ? "No encontramos disciplinas" : "Todavía no cargaste disciplinas"}
          description={q ? "Probá con otro nombre." : "Creá la primera para poder armar horarios y asignar alumnos."}
          action={
            !q && (
              <Link href="/activities/new">
                <Button size="sm">Crear</Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="flex flex-col gap-2">
          {activities.map((activity) => (
            <Link key={String(activity._id)} href={`/activities/${activity._id}`}>
              <Card className="flex items-center gap-3 transition hover:border-[var(--brand-primary)] hover:shadow-md">
                <Avatar name={activity.name} shape="square" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{activity.name}</p>
                  {activity.description && (
                    <p className="line-clamp-1 text-xs text-slate-500">{activity.description}</p>
                  )}
                </div>
                <Badge status={activity.status as StatusValue} />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
