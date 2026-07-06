import { ActivityIcon, HomeIcon, InstructorIcon, SettingsIcon, StudentsIcon } from "@/components/ui/icons";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: HomeIcon },
  { href: "/students", label: "Alumnos", icon: StudentsIcon },
  { href: "/activities", label: "Disciplinas", icon: ActivityIcon },
  { href: "/instructors", label: "Instructores", icon: InstructorIcon },
  { href: "/settings", label: "Ajustes", icon: SettingsIcon },
];
