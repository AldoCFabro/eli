import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOnboardedSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Student } from "@/models";
import { setStudentStatusAction, updateStudentAction } from "@/app/(app)/students/actions";
import { StudentForm } from "@/components/forms/StudentForm";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { StatusMenu } from "@/components/ui/StatusMenu";
import type { StatusValue } from "@/types";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { session } = await requireOnboardedSession();
  await connectDB();

  const student = await Student.findOne({ _id: id, businessId: session.businessId }).lean();
  if (!student) notFound();

  const boundUpdate = updateStudentAction.bind(null, id);
  const boundSetStatus = setStudentStatusAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link href="/students" className="flex items-center gap-1 text-sm text-slate-500">
          <ArrowLeftIcon className="h-4 w-4" /> Alumnos
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={`${student.firstName} ${student.lastName}`} size="lg" />
            <h1 className="text-xl font-semibold text-slate-900">
              {student.firstName} {student.lastName}
            </h1>
          </div>
          <StatusMenu status={student.status as StatusValue} onChange={boundSetStatus} />
        </div>
      </div>

      <StudentForm
        action={boundUpdate}
        submitLabel="Guardar cambios"
        initialValues={{
          firstName: student.firstName,
          lastName: student.lastName,
          birthDate: new Date(student.birthDate).toISOString().slice(0, 10),
          documentType: student.documentType,
          documentNumber: student.documentNumber,
          phone: student.phone,
          responsibleContactName: student.responsibleContactName,
          responsibleContactPhone: student.responsibleContactPhone,
          address: student.address,
          sex: student.sex,
          notes: student.notes,
        }}
      />
    </div>
  );
}
