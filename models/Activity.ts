import { Schema, model, models, type InferSchemaType } from "mongoose";
import { STATUS_VALUES } from "@/types";

const activitySchema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: STATUS_VALUES, default: "active" },
  },
  { timestamps: true }
);

activitySchema.index({ businessId: 1, name: 1 });

export type ActivityDoc = InferSchemaType<typeof activitySchema>;

export const Activity = models.Activity || model("Activity", activitySchema);
