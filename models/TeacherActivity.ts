import { Schema, model, models, type InferSchemaType } from "mongoose";

const teacherActivitySchema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true, index: true },
    activityId: { type: Schema.Types.ObjectId, ref: "Activity", required: true, index: true },
  },
  { timestamps: true }
);

teacherActivitySchema.index({ teacherId: 1, activityId: 1 }, { unique: true });

export type TeacherActivityDoc = InferSchemaType<typeof teacherActivitySchema>;

export const TeacherActivity =
  models.TeacherActivity || model("TeacherActivity", teacherActivitySchema);
