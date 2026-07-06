"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Teacher } from "@/models";
import { teacherSchema } from "@/lib/validations/person";
import { zodErrorState, type FormState } from "@/lib/action-state";
import type { StatusValue } from "@/types";

function readTeacherFormData(formData: FormData) {
  return {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    birthDate: formData.get("birthDate"),
    documentType: formData.get("documentType") ?? "DNI",
    documentNumber: formData.get("documentNumber") ?? "",
    phone: formData.get("phone") ?? "",
    address: formData.get("address") ?? "",
    sex: formData.get("sex") ?? "otro",
    notes: formData.get("notes") ?? "",
  };
}

export async function createTeacherAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const rawInput = readTeacherFormData(formData);
  const parsed = teacherSchema.safeParse(rawInput);
  if (!parsed.success) return zodErrorState(parsed.error, rawInput);

  await connectDB();
  const teacher = await Teacher.create({ ...parsed.data, businessId: session.businessId });
  redirect(`/teachers/${teacher._id}`);
}

export async function updateTeacherAction(
  teacherId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await requireSession();
  const rawInput = readTeacherFormData(formData);
  const parsed = teacherSchema.safeParse(rawInput);
  if (!parsed.success) return zodErrorState(parsed.error, rawInput);

  await connectDB();
  const updated = await Teacher.findOneAndUpdate(
    { _id: teacherId, businessId: session.businessId },
    parsed.data
  );
  if (!updated) return { error: "No encontramos ese profesor." };

  revalidatePath(`/teachers/${teacherId}`);
  revalidatePath("/teachers");
  return { success: true };
}

export async function setTeacherStatusAction(teacherId: string, status: StatusValue) {
  const session = await requireSession();
  await connectDB();

  await Teacher.updateOne({ _id: teacherId, businessId: session.businessId }, { status });

  revalidatePath(`/teachers/${teacherId}`);
  revalidatePath("/teachers");
}
