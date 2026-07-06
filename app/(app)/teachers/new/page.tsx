import Link from "next/link";
import { createTeacherAction } from "@/app/(app)/teachers/actions";
import { TeacherForm } from "@/components/forms/TeacherForm";
import { ArrowLeftIcon } from "@/components/ui/icons";

export default function NewTeacherPage() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/teachers" className="flex items-center gap-1 text-sm text-slate-500">
        <ArrowLeftIcon className="h-4 w-4" /> Profesores
      </Link>
      <h1 className="text-xl font-semibold text-slate-900">Nuevo profesor</h1>
      <TeacherForm action={createTeacherAction} submitLabel="Crear profesor" />
    </div>
  );
}
