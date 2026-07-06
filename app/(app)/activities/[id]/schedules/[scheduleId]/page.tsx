import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Activity, Instructor, Schedule } from "@/models";
import { updateScheduleAction } from "@/app/(app)/activities/[id]/schedules/actions";
import { ScheduleForm } from "@/components/forms/ScheduleForm";
import { ArrowLeftIcon } from "@/components/ui/icons";

export default async function EditSchedulePage({
  params,
}: {
  params: Promise<{ id: string; scheduleId: string }>;
}) {
  const { id, scheduleId } = await params;
  const session = await requireSession();
  await connectDB();

  const [activity, schedule, instructors] = await Promise.all([
    Activity.findOne({ _id: id, businessId: session.businessId }).lean(),
    Schedule.findOne({ _id: scheduleId, businessId: session.businessId, activityId: id }).lean(),
    Instructor.find({ businessId: session.businessId, status: "active" }).sort({ lastName: 1 }).lean(),
  ]);

  if (!activity || !schedule) notFound();

  const boundUpdate = updateScheduleAction.bind(null, id, scheduleId);

  return (
    <div className="flex flex-col gap-4">
      <Link href={`/activities/${id}`} className="flex items-center gap-1 text-sm text-slate-500">
        <ArrowLeftIcon className="h-4 w-4" /> {activity.name}
      </Link>
      <h1 className="text-xl font-semibold text-slate-900">Editar horario</h1>
      <ScheduleForm
        action={boundUpdate}
        instructors={instructors}
        submitLabel="Guardar cambios"
        defaultValues={{
          instructorId: schedule.instructorId ? String(schedule.instructorId) : "",
          title: schedule.title,
          daysOfWeek: schedule.daysOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          location: schedule.location,
        }}
      />
    </div>
  );
}
