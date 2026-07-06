import Link from "next/link";
import { requireOnboardedSession } from "@/lib/auth/guard";
import { createActivityAction } from "@/app/(app)/activities/actions";
import { ActivityForm } from "@/components/forms/ActivityForm";
import { ArrowLeftIcon } from "@/components/ui/icons";

export default async function NewActivityPage() {
  await requireOnboardedSession();

  return (
    <div className="flex flex-col gap-4">
      <Link href="/activities" className="flex items-center gap-1 text-sm text-slate-500">
        <ArrowLeftIcon className="h-4 w-4" /> Disciplinas
      </Link>
      <h1 className="text-xl font-semibold text-slate-900">Nueva disciplina</h1>
      <ActivityForm action={createActivityAction} submitLabel="Crear" />
    </div>
  );
}
