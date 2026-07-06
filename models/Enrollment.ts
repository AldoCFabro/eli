import { Schema, model, models, type InferSchemaType } from "mongoose";
import { STATUS_VALUES } from "@/types";

const enrollmentSchema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    activityId: { type: Schema.Types.ObjectId, ref: "Activity", required: true, index: true },
    status: { type: String, enum: STATUS_VALUES, default: "active" },
  },
  { timestamps: true }
);

enrollmentSchema.index({ studentId: 1, activityId: 1 }, { unique: true });

export type EnrollmentDoc = InferSchemaType<typeof enrollmentSchema>;

export const Enrollment = models.Enrollment || model("Enrollment", enrollmentSchema);
