import { z } from "zod";
import { BUSINESS_TYPES } from "@/types";

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, { error: "Usá un color hexadecimal válido, ej: #4f46e5" });

export const businessProfileSchema = z.object({
  name: z.string().min(1, { error: "El nombre del negocio es obligatorio." }).trim(),
  type: z.enum(BUSINESS_TYPES, { error: "Elegí un tipo de negocio." }),
  brandPrimaryColor: hexColor,
  brandSecondaryColor: hexColor,
  phone: z.string().optional().default(""),
  address: z.string().optional().default(""),
});

export type BusinessProfileInput = z.infer<typeof businessProfileSchema>;
