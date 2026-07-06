export const BUSINESS_TYPES = [
  "academia",
  "club",
  "gimnasio",
  "taller",
  "escuela",
  "otro",
] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const USER_ROLES = ["owner", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const STATUS_VALUES = ["active", "inactive", "archived"] as const;
export type StatusValue = (typeof STATUS_VALUES)[number];

export const SEX_VALUES = ["femenino", "masculino", "otro"] as const;
export type SexValue = (typeof SEX_VALUES)[number];

export const DOCUMENT_TYPES = ["DNI", "CUIL", "CUIT"] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DAYS_OF_WEEK = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export type SessionPayload = {
  userId: string;
  businessId: string;
  role: UserRole;
  email: string;
};
