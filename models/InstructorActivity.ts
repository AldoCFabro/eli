import { Schema, model, models, type InferSchemaType } from "mongoose";

const instructorActivitySchema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    instructorId: { type: Schema.Types.ObjectId, ref: "Instructor", required: true, index: true },
    activityId: { type: Schema.Types.ObjectId, ref: "Activity", required: true, index: true },
  },
  { timestamps: true }
);

instructorActivitySchema.index({ instructorId: 1, activityId: 1 }, { unique: true });

export type InstructorActivityDoc = InferSchemaType<typeof instructorActivitySchema>;

export const InstructorActivity =
  models.InstructorActivity || model("InstructorActivity", instructorActivitySchema);
