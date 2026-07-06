import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Activity, Instructor } from "@/models";
import { createScheduleAction } from "@/app/(app)/activities/[id]/schedules/actions";
import { ScheduleForm } from "@/components/forms/ScheduleForm";
import { ArrowLeftIcon } from "@/components/ui/icons";

export default async function NewSchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();
  await connectDB();

  const activity = await Activity.findOne({ _id: id, businessId: session.businessId }).lean();
  if (!activity) notFound();

  const instructors = await Instructor.find({ businessId: session.businessId, status: "active" })
    .sort({ lastName: 1 })
    .lean();

  const boundCreate = createScheduleAction.bind(null, id);

  return (
    <div className="flex flex-col gap-4">
      <Link href={`/activities/${id}`} className="flex items-center gap-1 text-sm text-slate-500">
        <ArrowLeftIcon className="h-4 w-4" /> {activity.name}
      </Link>
      <h1 className="text-xl font-semibold text-slate-900">Nuevo horario</h1>
      <ScheduleForm action={boundCreate} instructors={instructors} submitLabel="Crear horario" />
    </div>
  );
}
