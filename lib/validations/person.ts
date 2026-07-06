import { z } from "zod";
import { DOCUMENT_TYPES, SEX_VALUES, STATUS_VALUES } from "@/types";

const isMinor = (birthDate: Date) => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  const exactAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
  return exactAge < 18;
};

const basePersonSchema = z.object({
  firstName: z.string().min(1, { error: "El nombre es obligatorio." }).trim(),
  lastName: z.string().min(1, { error: "El apellido es obligatorio." }).trim(),
  birthDate: z.coerce.date({ error: "La fecha de nacimiento es obligatoria." }),
  documentType: z.enum(DOCUMENT_TYPES).default("DNI"),
  documentNumber: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  address: z.string().optional().default(""),
  sex: z.enum(SEX_VALUES).default("otro"),
  status: z.enum(STATUS_VALUES).default("active"),
  notes: z.string().optional().default(""),
});

export const instructorSchema = basePersonSchema.extend({
  position: z.string().optional().default(""),
});

export const studentSchema = basePersonSchema
  .extend({
    responsibleContactName: z.string().optional().default(""),
    responsibleContactPhone: z.string().optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (isMinor(data.birthDate) && !data.responsibleContactName.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["responsibleContactName"],
        message: "El alumno es menor de edad: cargá un contacto responsable.",
      });
    }
  });

export type InstructorInput = z.infer<typeof instructorSchema>;
export type StudentInput = z.infer<typeof studentSchema>;
