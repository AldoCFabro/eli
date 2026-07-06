"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Student } from "@/models";
import { studentSchema } from "@/lib/validations/person";
import { zodErrorState, type FormState } from "@/lib/action-state";
import type { StatusValue } from "@/types";

function readStudentFormData(formData: FormData) {
  return {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    birthDate: formData.get("birthDate"),
    documentType: formData.get("documentType") ?? "DNI",
    documentNumber: formData.get("documentNumber") ?? "",
    phone: formData.get("phone") ?? "",
    responsibleContactName: formData.get("responsibleContactName") ?? "",
    responsibleContactPhone: formData.get("responsibleContactPhone") ?? "",
    address: formData.get("address") ?? "",
    sex: formData.get("sex") ?? "otro",
    notes: formData.get("notes") ?? "",
  };
}

export async function createStudentAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const rawInput = readStudentFormData(formData);
  const parsed = studentSchema.safeParse(rawInput);
  if (!parsed.success) return zodErrorState(parsed.error, rawInput);

  await connectDB();
  const student = await Student.create({ ...parsed.data, businessId: session.businessId });
  redirect(`/students/${student._id}`);
}

export async function updateStudentAction(
  studentId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await requireSession();
  const rawInput = readStudentFormData(formData);
  const parsed = studentSchema.safeParse(rawInput);
  if (!parsed.success) return zodErrorState(parsed.error, rawInput);

  await connectDB();
  const updated = await Student.findOneAndUpdate(
    { _id: studentId, businessId: session.businessId },
    parsed.data
  );
  if (!updated) return { error: "No encontramos ese alumno." };

  revalidatePath(`/students/${studentId}`);
  revalidatePath("/students");
  return { success: true };
}

export async function setStudentStatusAction(studentId: string, status: StatusValue) {
  const session = await requireSession();
  await connectDB();

  await Student.updateOne({ _id: studentId, businessId: session.businessId }, { status });

  revalidatePath(`/students/${studentId}`);
  revalidatePath("/students");
}
