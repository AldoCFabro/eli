import { z } from "zod";
import { DAYS_OF_WEEK, STATUS_VALUES } from "@/types";

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const scheduleSchema = z
  .object({
    activityId: z.string().min(1, { error: "Elegí una actividad." }),
    instructorId: z.string().optional().default(""),
    title: z.string().optional().default(""),
    daysOfWeek: z
      .array(z.enum(DAYS_OF_WEEK))
      .min(1, { error: "Elegí al menos un día de la semana." }),
    startTime: z.string().regex(timePattern, { error: "Hora de inicio inválida (HH:MM)." }),
    endTime: z.string().regex(timePattern, { error: "Hora de fin inválida (HH:MM)." }),
    location: z.string().optional().default(""),
    status: z.enum(STATUS_VALUES).default("active"),
  })
  .refine((data) => data.endTime > data.startTime, {
    error: "La hora de fin debe ser posterior a la hora de inicio.",
    path: ["endTime"],
  });

export type ScheduleInput = z.infer<typeof scheduleSchema>;
