import { Schema, model, models, type InferSchemaType } from "mongoose";
import { BUSINESS_TYPES } from "@/types";

const businessSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: BUSINESS_TYPES, required: true },
    logoUrl: { type: String, default: null },
    brandPrimaryColor: { type: String, default: "#4f46e5" },
    brandSecondaryColor: { type: String, default: "#14b8a6" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    onboardingCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type BusinessDoc = InferSchemaType<typeof businessSchema>;

export const Business = models.Business || model("Business", businessSchema);
