"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Activity, Enrollment, TeacherActivity } from "@/models";
import { activitySchema } from "@/lib/validations/activity";
import { zodErrorState, type FormState } from "@/lib/action-state";
import type { StatusValue } from "@/types";

function readActivityFormData(formData: FormData) {
  return {
    name: formData.get("name"),
    description: formData.get("description") ?? "",
  };
}

export async function createActivityAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession();
  const rawInput = readActivityFormData(formData);
  const parsed = activitySchema.safeParse(rawInput);
  if (!parsed.success) return zodErrorState(parsed.error, rawInput);

  await connectDB();
  const activity = await Activity.create({ ...parsed.data, businessId: session.businessId });
  redirect(`/activities/${activity._id}`);
}

export async function updateActivityAction(
  activityId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await requireSession();
  const rawInput = readActivityFormData(formData);
  const parsed = activitySchema.safeParse(rawInput);
  if (!parsed.success) return zodErrorState(parsed.error, rawInput);

  await connectDB();
  const updated = await Activity.findOneAndUpdate(
    { _id: activityId, businessId: session.businessId },
    parsed.data
  );
  if (!updated) return { error: "No encontramos esa disciplina." };

  revalidatePath(`/activities/${activityId}`);
  revalidatePath("/activities");
  return { success: true };
}

export async function setActivityStatusAction(activityId: string, status: StatusValue) {
  const session = await requireSession();
  await connectDB();

  await Activity.updateOne({ _id: activityId, businessId: session.businessId }, { status });

  revalidatePath(`/activities/${activityId}`);
  revalidatePath("/activities");
}

export async function setActivityStudentsAction(activityId: string, formData: FormData) {
  const session = await requireSession();
  await connectDB();

  const activity = await Activity.findOne({ _id: activityId, businessId: session.businessId }).lean();
  if (!activity) return;

  const selectedStudentIds = formData.getAll("studentIds").map(String);

  await Enrollment.deleteMany({
    businessId: session.businessId,
    activityId,
    studentId: { $nin: selectedStudentIds },
  });

  for (const studentId of selectedStudentIds) {
    await Enrollment.findOneAndUpdate(
      { businessId: session.businessId, activityId, studentId },
      { status: "active" },
      { upsert: true }
    );
  }

  revalidatePath(`/activities/${activityId}`);
}

export async function setActivityTeachersAction(activityId: string, formData: FormData) {
  const session = await requireSession();
  await connectDB();

  const activity = await Activity.findOne({ _id: activityId, businessId: session.businessId }).lean();
  if (!activity) return;

  const selectedTeacherIds = formData.getAll("teacherIds").map(String);

  await TeacherActivity.deleteMany({
    businessId: session.businessId,
    activityId,
    teacherId: { $nin: selectedTeacherIds },
  });

  for (const teacherId of selectedTeacherIds) {
    await TeacherActivity.findOneAndUpdate(
      { businessId: session.businessId, activityId, teacherId },
      {},
      { upsert: true }
    );
  }

  revalidatePath(`/activities/${activityId}`);
}
