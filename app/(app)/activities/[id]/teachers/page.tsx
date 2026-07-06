import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOnboardedSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Activity, Teacher, TeacherActivity } from "@/models";
import { setActivityTeachersAction } from "@/app/(app)/activities/actions";
import { RosterPicker } from "@/components/forms/RosterPicker";
import { ArrowLeftIcon } from "@/components/ui/icons";

export default async function ActivityTeachersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { session } = await requireOnboardedSession();
  await connectDB();

  const activity = await Activity.findOne({ _id: id, businessId: session.businessId }).lean();
  if (!activity) notFound();

  const [teachers, teacherLinks] = await Promise.all([
    Teacher.find({ businessId: session.businessId, status: "active" }).sort({ lastName: 1 }).lean(),
    TeacherActivity.find({ businessId: session.businessId, activityId: id }).lean(),
  ]);

  const boundSetTeachers = setActivityTeachersAction.bind(null, id);

  return (
    <div className="flex flex-col gap-4">
      <Link href={`/activities/${id}`} className="flex items-center gap-1 text-sm text-slate-500">
        <ArrowLeftIcon className="h-4 w-4" /> {activity.name}
      </Link>
      <h1 className="text-xl font-semibold text-slate-900">Profesores en {activity.name}</h1>

      <RosterPicker
        items={teachers.map((t) => ({ _id: String(t._id), label: `${t.firstName} ${t.lastName}` }))}
        initialSelectedIds={teacherLinks.map((t) => String(t.teacherId))}
        action={boundSetTeachers}
        fieldName="teacherIds"
        searchPlaceholder="Buscar profesor por nombre..."
        backHref={`/activities/${id}`}
        emptyTitle="No hay profesores activos"
        emptyDescription="Creá profesores primero para poder asignarlos a esta disciplina."
      />
    </div>
  );
}
