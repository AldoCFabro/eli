import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOnboardedSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Activity, Instructor, InstructorActivity } from "@/models";
import { setActivityInstructorsAction } from "@/app/(app)/activities/actions";
import { RosterPicker } from "@/components/forms/RosterPicker";
import { ArrowLeftIcon } from "@/components/ui/icons";

export default async function ActivityInstructorsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { session } = await requireOnboardedSession();
  await connectDB();

  const activity = await Activity.findOne({ _id: id, businessId: session.businessId }).lean();
  if (!activity) notFound();

  const [instructors, instructorLinks] = await Promise.all([
    Instructor.find({ businessId: session.businessId, status: "active" }).sort({ lastName: 1 }).lean(),
    InstructorActivity.find({ businessId: session.businessId, activityId: id }).lean(),
  ]);

  const boundSetInstructors = setActivityInstructorsAction.bind(null, id);

  return (
    <div className="flex flex-col gap-4">
      <Link href={`/activities/${id}`} className="flex items-center gap-1 text-sm text-slate-500">
        <ArrowLeftIcon className="h-4 w-4" /> {activity.name}
      </Link>
      <h1 className="text-xl font-semibold text-slate-900">Instructores en {activity.name}</h1>

      <RosterPicker
        items={instructors.map((t) => ({ _id: String(t._id), label: `${t.firstName} ${t.lastName}` }))}
        initialSelectedIds={instructorLinks.map((t) => String(t.instructorId))}
        action={boundSetInstructors}
        fieldName="instructorIds"
        searchPlaceholder="Buscar instructor por nombre..."
        backHref={`/activities/${id}`}
        emptyTitle="No hay instructores activos"
        emptyDescription="Creá instructores primero para poder asignarlos a esta disciplina."
      />
    </div>
  );
}
