import { ActivityIcon, HomeIcon, SettingsIcon, StudentsIcon, TeacherIcon } from "@/components/ui/icons";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: HomeIcon },
  { href: "/students", label: "Alumnos", icon: StudentsIcon },
  { href: "/activities", label: "Disciplinas", icon: ActivityIcon },
  { href: "/teachers", label: "Profesores", icon: TeacherIcon },
  { href: "/settings", label: "Ajustes", icon: SettingsIcon },
];
