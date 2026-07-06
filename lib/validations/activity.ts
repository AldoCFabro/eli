import { z } from "zod";
import { STATUS_VALUES } from "@/types";

export const activitySchema = z.object({
  name: z.string().min(1, { error: "El nombre de la actividad es obligatorio." }).trim(),
  description: z.string().optional().default(""),
  status: z.enum(STATUS_VALUES).default("active"),
});

export type ActivityInput = z.infer<typeof activitySchema>;
