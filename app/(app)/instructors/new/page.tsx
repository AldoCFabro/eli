import Link from "next/link";
import { createInstructorAction } from "@/app/(app)/instructors/actions";
import { InstructorForm } from "@/components/forms/InstructorForm";
import { ArrowLeftIcon } from "@/components/ui/icons";

export default function NewInstructorPage() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/instructors" className="flex items-center gap-1 text-sm text-slate-500">
        <ArrowLeftIcon className="h-4 w-4" /> Instructores
      </Link>
      <h1 className="text-xl font-semibold text-slate-900">Nuevo instructor</h1>
      <InstructorForm action={createInstructorAction} submitLabel="Crear instructor" />
    </div>
  );
}
