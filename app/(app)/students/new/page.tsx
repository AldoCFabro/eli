import Link from "next/link";
import { createStudentAction } from "@/app/(app)/students/actions";
import { StudentForm } from "@/components/forms/StudentForm";
import { ArrowLeftIcon } from "@/components/ui/icons";

export default function NewStudentPage() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/students" className="flex items-center gap-1 text-sm text-slate-500">
        <ArrowLeftIcon className="h-4 w-4" /> Alumnos
      </Link>
      <h1 className="text-xl font-semibold text-slate-900">Nuevo alumno</h1>
      <StudentForm action={createStudentAction} submitLabel="Crear alumno" />
    </div>
  );
}
