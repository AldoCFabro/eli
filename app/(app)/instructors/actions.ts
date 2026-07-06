"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Instructor } from "@/models";
import { instructorSchema } from "@/lib/validations/person";
import { zodErrorState, type FormState } from "@/lib/action-state";
import type { StatusValue } from "@/types";

function readInstructorFormData(formData: FormData) {
  return {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    birthDate: formData.get("birthDate"),
    position: formData.get("position") ?? "",
    documentType: formData.get("documentType") ?? "DNI",
    documentNumber: formData.get("documentNumber") ?? "",
    phone: formData.get("phone") ?? "",
    address: formData.get("address") ?? "",
    sex: formData.get("sex") ?? "otro",
    notes: formData.get("notes") ?? "",
  };
}

export async function createInstructorAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const rawInput = readInstructorFormData(formData);
  const parsed = instructorSchema.safeParse(rawInput);
  if (!parsed.success) return zodErrorState(parsed.error, rawInput);

  await connectDB();
  const instructor = await Instructor.create({ ...parsed.data, businessId: session.businessId });
  redirect(`/instructors/${instructor._id}`);
}

export async function updateInstructorAction(
  instructorId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await requireSession();
  const rawInput = readInstructorFormData(formData);
  const parsed = instructorSchema.safeParse(rawInput);
  if (!parsed.success) return zodErrorState(parsed.error, rawInput);

  await connectDB();
  const updated = await Instructor.findOneAndUpdate(
    { _id: instructorId, businessId: session.businessId },
    parsed.data
  );
  if (!updated) return { error: "No encontramos ese instructor." };

  revalidatePath(`/instructors/${instructorId}`);
  revalidatePath("/instructors");
  return { success: true };
}

export async function setInstructorStatusAction(instructorId: string, status: StatusValue) {
  const session = await requireSession();
  await connectDB();

  await Instructor.updateOne({ _id: instructorId, businessId: session.businessId }, { status });

  revalidatePath(`/instructors/${instructorId}`);
  revalidatePath("/instructors");
}
