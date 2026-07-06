import { Schema, model, models, type InferSchemaType } from "mongoose";
import { DAYS_OF_WEEK, STATUS_VALUES } from "@/types";

const scheduleSchema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    activityId: { type: Schema.Types.ObjectId, ref: "Activity", required: true, index: true },
    instructorId: { type: Schema.Types.ObjectId, ref: "Instructor", default: null },
    title: { type: String, default: "" },
    daysOfWeek: { type: [String], enum: DAYS_OF_WEEK, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: { type: String, default: "" },
    status: { type: String, enum: STATUS_VALUES, default: "active" },
  },
  { timestamps: true }
);

scheduleSchema.index({ businessId: 1, activityId: 1 });

export type ScheduleDoc = InferSchemaType<typeof scheduleSchema>;

export const Schedule = models.Schedule || model("Schedule", scheduleSchema);
