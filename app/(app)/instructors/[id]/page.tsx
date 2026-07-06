import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOnboardedSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Instructor } from "@/models";
import { setInstructorStatusAction, updateInstructorAction } from "@/app/(app)/instructors/actions";
import { InstructorForm } from "@/components/forms/InstructorForm";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { StatusMenu } from "@/components/ui/StatusMenu";
import type { StatusValue } from "@/types";

export default async function InstructorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { session } = await requireOnboardedSession();
  await connectDB();

  const instructor = await Instructor.findOne({ _id: id, businessId: session.businessId }).lean();
  if (!instructor) notFound();

  const boundUpdate = updateInstructorAction.bind(null, id);
  const boundSetStatus = setInstructorStatusAction.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link href="/instructors" className="flex items-center gap-1 text-sm text-slate-500">
          <ArrowLeftIcon className="h-4 w-4" /> Instructores
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={`${instructor.firstName} ${instructor.lastName}`} size="lg" />
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                {instructor.firstName} {instructor.lastName}
              </h1>
              {instructor.position && <p className="text-sm text-slate-500">{instructor.position}</p>}
            </div>
          </div>
          <StatusMenu status={instructor.status as StatusValue} onChange={boundSetStatus} />
        </div>
      </div>

      <InstructorForm
        action={boundUpdate}
        submitLabel="Guardar cambios"
        initialValues={{
          firstName: instructor.firstName,
          lastName: instructor.lastName,
          birthDate: new Date(instructor.birthDate).toISOString().slice(0, 10),
          position: instructor.position,
          documentType: instructor.documentType,
          documentNumber: instructor.documentNumber,
          phone: instructor.phone,
          address: instructor.address,
          sex: instructor.sex,
          notes: instructor.notes,
        }}
      />
    </div>
  );
}
