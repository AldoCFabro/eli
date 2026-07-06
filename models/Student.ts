import { Schema, model, models, type InferSchemaType } from "mongoose";
import { DOCUMENT_TYPES, SEX_VALUES, STATUS_VALUES } from "@/types";

const studentSchema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    birthDate: { type: Date, required: true },
    documentType: { type: String, enum: DOCUMENT_TYPES, default: "DNI" },
    documentNumber: { type: String, default: "" },
    phone: { type: String, default: "" },
    responsibleContactName: { type: String, default: "" },
    responsibleContactPhone: { type: String, default: "" },
    address: { type: String, default: "" },
    sex: { type: String, enum: SEX_VALUES, default: "otro" },
    status: { type: String, enum: STATUS_VALUES, default: "active" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

studentSchema.index({ businessId: 1, lastName: 1 });

export type StudentDoc = InferSchemaType<typeof studentSchema>;

export const Student = models.Student || model("Student", studentSchema);
