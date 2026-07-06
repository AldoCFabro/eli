import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOnboardedSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Teacher } from "@/models";
import { setTeacherStatusAction, updateTeacherAction } from "@/app/(app)/teachers/actions";
import { TeacherForm } from "@/components/forms/TeacherForm";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { StatusMenu } from "@/components/ui/StatusMenu";
import type { StatusValue } from "@/types";

export default async function TeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { session } = await requireOnboardedSession();
  await connectDB();

  const teacher = await Teacher.findOne({ _id: id, businessId: session.businessId }).lean();
  if (!teacher) notFound();

  const boundUpdate = updateTeacherAction.bind(null, id);
  const boundSetStatus = setTeacherStatusAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link href="/teachers" className="flex items-center gap-1 text-sm text-slate-500">
          <ArrowLeftIcon className="h-4 w-4" /> Profesores
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={`${teacher.firstName} ${teacher.lastName}`} size="lg" />
            <h1 className="text-xl font-semibold text-slate-900">
              {teacher.firstName} {teacher.lastName}
            </h1>
          </div>
          <StatusMenu status={teacher.status as StatusValue} onChange={boundSetStatus} />
        </div>
      </div>

      <TeacherForm
        action={boundUpdate}
        submitLabel="Guardar cambios"
        initialValues={{
          firstName: teacher.firstName,
          lastName: teacher.lastName,
          birthDate: new Date(teacher.birthDate).toISOString().slice(0, 10),
          documentType: teacher.documentType,
          documentNumber: teacher.documentNumber,
          phone: teacher.phone,
          address: teacher.address,
          sex: teacher.sex,
          notes: teacher.notes,
        }}
      />
    </div>
  );
}
