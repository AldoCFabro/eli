"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Schedule } from "@/models";
import { scheduleSchema } from "@/lib/validations/schedule";
import { zodErrorState, type FormState } from "@/lib/action-state";

function readScheduleFormData(formData: FormData, activityId: string) {
  return {
    activityId,
    instructorId: formData.get("instructorId") ?? "",
    title: formData.get("title") ?? "",
    daysOfWeek: formData.getAll("daysOfWeek"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    location: formData.get("location") ?? "",
  };
}

export async function createScheduleAction(
  activityId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await requireSession();
  const rawInput = readScheduleFormData(formData, activityId);
  const parsed = scheduleSchema.safeParse(rawInput);
  if (!parsed.success) return zodErrorState(parsed.error, rawInput);

  await connectDB();
  await Schedule.create({
    ...parsed.data,
    instructorId: parsed.data.instructorId || null,
    businessId: session.businessId,
  });

  redirect(`/activities/${activityId}`);
}

export async function updateScheduleAction(
  activityId: string,
  scheduleId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await requireSession();
  const rawInput = readScheduleFormData(formData, activityId);
  const parsed = scheduleSchema.safeParse(rawInput);
  if (!parsed.success) return zodErrorState(parsed.error, rawInput);

  await connectDB();
  const updated = await Schedule.findOneAndUpdate(
    { _id: scheduleId, businessId: session.businessId },
    { ...parsed.data, instructorId: parsed.data.instructorId || null }
  );
  if (!updated) return { error: "No encontramos ese horario." };

  redirect(`/activities/${activityId}`);
}

export async function toggleScheduleStatusAction(activityId: string, scheduleId: string) {
  const session = await requireSession();
  await connectDB();

  const schedule = await Schedule.findOne({ _id: scheduleId, businessId: session.businessId });
  if (!schedule) return;

  schedule.status = schedule.status === "active" ? "inactive" : "active";
  await schedule.save();

  revalidatePath(`/activities/${activityId}`);
}

export async function deleteScheduleAction(activityId: string, scheduleId: string) {
  const session = await requireSession();
  await connectDB();

  await Schedule.deleteOne({ _id: scheduleId, businessId: session.businessId });

  revalidatePath(`/activities/${activityId}`);
}
