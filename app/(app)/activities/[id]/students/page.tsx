import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOnboardedSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Activity, Enrollment, Student } from "@/models";
import { setActivityStudentsAction } from "@/app/(app)/activities/actions";
import { RosterPicker } from "@/components/forms/RosterPicker";
import { ArrowLeftIcon } from "@/components/ui/icons";

export default async function ActivityStudentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { session } = await requireOnboardedSession();
  await connectDB();

  const activity = await Activity.findOne({ _id: id, businessId: session.businessId }).lean();
  if (!activity) notFound();

  const [students, enrollments] = await Promise.all([
    Student.find({ businessId: session.businessId, status: "active" }).sort({ lastName: 1 }).lean(),
    Enrollment.find({ businessId: session.businessId, activityId: id, status: "active" }).lean(),
  ]);

  const boundSetStudents = setActivityStudentsAction.bind(null, id);

  return (
    <div className="flex flex-col gap-4">
      <Link href={`/activities/${id}`} className="flex items-center gap-1 text-sm text-slate-500">
        <ArrowLeftIcon className="h-4 w-4" /> {activity.name}
      </Link>
      <h1 className="text-xl font-semibold text-slate-900">Alumnos en {activity.name}</h1>

      <RosterPicker
        items={students.map((s) => ({ _id: String(s._id), label: `${s.firstName} ${s.lastName}` }))}
        initialSelectedIds={enrollments.map((e) => String(e.studentId))}
        action={boundSetStudents}
        fieldName="studentIds"
        searchPlaceholder="Buscar alumno por nombre..."
        backHref={`/activities/${id}`}
        emptyTitle="No hay alumnos activos"
        emptyDescription="Creá alumnos primero para poder asignarlos a esta disciplina."
      />
    </div>
  );
}
