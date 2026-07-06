import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOnboardedSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Activity, Enrollment, InstructorActivity, Schedule } from "@/models";
import { setActivityStatusAction, updateActivityAction } from "@/app/(app)/activities/actions";
import {
  deleteScheduleAction,
  toggleScheduleStatusAction,
} from "@/app/(app)/activities/[id]/schedules/actions";
import { ActivityForm } from "@/components/forms/ActivityForm";
import { RosterPreview } from "@/components/forms/RosterPreview";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusMenu } from "@/components/ui/StatusMenu";
import { ArrowLeftIcon, PlusIcon } from "@/components/ui/icons";
import { DAY_LABELS_SHORT } from "@/lib/labels";
import type { DayOfWeek, StatusValue } from "@/types";

export default async function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { session } = await requireOnboardedSession();
  await connectDB();

  const activity = await Activity.findOne({ _id: id, businessId: session.businessId }).lean();
  if (!activity) notFound();

  const [schedules, enrollments, instructorLinks] = await Promise.all([
    Schedule.find({ businessId: session.businessId, activityId: id })
      .sort({ startTime: 1 })
      .populate("instructorId", "firstName lastName")
      .lean(),
    Enrollment.find({ businessId: session.businessId, activityId: id, status: "active" })
      .populate("studentId", "firstName lastName")
      .lean(),
    InstructorActivity.find({ businessId: session.businessId, activityId: id })
      .populate("instructorId", "firstName lastName")
      .lean(),
  ]);

  const boundUpdate = updateActivityAction.bind(null, id);
  const boundSetStatus = setActivityStatusAction.bind(null, id);

  const studentItems = enrollments
    .map((e) => e.studentId as unknown as { _id: unknown; firstName: string; lastName: string } | null)
    .filter((s): s is { _id: unknown; firstName: string; lastName: string } => Boolean(s))
    .map((s) => ({ _id: String(s._id), label: `${s.firstName} ${s.lastName}` }));

  const instructorItems = instructorLinks
    .map((t) => t.instructorId as unknown as { _id: unknown; firstName: string; lastName: string } | null)
    .filter((t): t is { _id: unknown; firstName: string; lastName: string } => Boolean(t))
    .map((t) => ({ _id: String(t._id), label: `${t.firstName} ${t.lastName}` }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link href="/activities" className="flex items-center gap-1 text-sm text-slate-500">
          <ArrowLeftIcon className="h-4 w-4" /> Disciplinas
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={activity.name} size="lg" shape="square" />
            <h1 className="text-xl font-semibold text-slate-900">{activity.name}</h1>
          </div>
          <StatusMenu status={activity.status as StatusValue} onChange={boundSetStatus} />
        </div>
      </div>

      <ActivityForm
        action={boundUpdate}
        submitLabel="Guardar cambios"
        initialValues={{ name: activity.name, description: activity.description }}
      />

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Horarios</h2>
          <Link href={`/activities/${id}/schedules/new`}>
            <Button size="sm" variant="secondary">
              <PlusIcon className="h-4 w-4" /> Nuevo horario
            </Button>
          </Link>
        </div>

        {schedules.length === 0 ? (
          <EmptyState title="No hay horarios cargados" description="Creá el primer horario recurrente." />
        ) : (
          <div className="flex flex-col gap-2">
            {schedules.map((schedule) => {
              const instructorDoc = schedule.instructorId as unknown as
                | { firstName?: string; lastName?: string }
                | null;
              const boundScheduleToggle = toggleScheduleStatusAction.bind(null, id, String(schedule._id));
              const boundScheduleDelete = deleteScheduleAction.bind(null, id, String(schedule._id));
              return (
                <Card key={String(schedule._id)} className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {schedule.title || activity.name} · {schedule.startTime}-{schedule.endTime}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(schedule.daysOfWeek as DayOfWeek[]).map((d) => DAY_LABELS_SHORT[d]).join(", ")}
                        {schedule.location ? ` · ${schedule.location}` : ""}
                        {instructorDoc ? ` · ${instructorDoc.firstName} ${instructorDoc.lastName}` : ""}
                      </p>
                    </div>
                    <Badge status={schedule.status as StatusValue} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/activities/${id}/schedules/${schedule._id}`}>
                      <Button size="sm" variant="secondary">
                        Editar
                      </Button>
                    </Link>
                    <form action={boundScheduleToggle}>
                      <Button type="submit" size="sm" variant="ghost">
                        {schedule.status === "active" ? "Desactivar" : "Activar"}
                      </Button>
                    </form>
                    <form action={boundScheduleDelete}>
                      <ConfirmSubmitButton
                        size="sm"
                        variant="danger"
                        confirmMessage="¿Eliminar este horario? Esta acción no se puede deshacer."
                      >
                        Eliminar
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Alumnos ({studentItems.length})</h2>
          <Link href={`/activities/${id}/students`}>
            <Button size="sm" variant="secondary">
              Editar
            </Button>
          </Link>
        </div>
        <RosterPreview
          items={studentItems}
          emptyLabel="Todavía no hay alumnos asignados."
          hrefBase="/students"
        />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Instructores ({instructorItems.length})</h2>
          <Link href={`/activities/${id}/instructors`}>
            <Button size="sm" variant="secondary">
              Editar
            </Button>
          </Link>
        </div>
        <RosterPreview
          items={instructorItems}
          emptyLabel="Todavía no hay instructores asignados."
          hrefBase="/instructors"
        />
      </section>
    </div>
  );
}
