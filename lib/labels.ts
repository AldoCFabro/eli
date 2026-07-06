import type { BusinessType, DayOfWeek, SexValue, StatusValue } from "@/types";

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  academia: "Academia",
  club: "Club",
  gimnasio: "Gimnasio",
  taller: "Taller",
  escuela: "Escuela",
  otro: "Otro",
};

export const SEX_LABELS: Record<SexValue, string> = {
  femenino: "Femenino",
  masculino: "Masculino",
  otro: "Otro",
};

export const STATUS_LABELS: Record<StatusValue, string> = {
  active: "Activo",
  inactive: "Inactivo",
  archived: "Archivado",
};

export const DAY_LABELS: Record<DayOfWeek, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

export const DAY_LABELS_SHORT: Record<DayOfWeek, string> = {
  lunes: "Lun",
  martes: "Mar",
  miercoles: "Mié",
  jueves: "Jue",
  viernes: "Vie",
  sabado: "Sáb",
  domingo: "Dom",
};
