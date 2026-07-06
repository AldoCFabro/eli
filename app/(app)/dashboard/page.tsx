import Link from "next/link";
import { requireOnboardedSession } from "@/lib/auth/guard";
import { connectDB } from "@/lib/db/connect";
import { Activity, Schedule, Student, Teacher } from "@/models";
import { Card } from "@/components/ui/Card";
import { ActivityIcon, ClockIcon, StudentsIcon, TeacherIcon } from "@/components/ui/icons";
import { DAY_LABELS } from "@/lib/labels";
import type { DayOfWeek } from "@/types";

const WEEKDAY_INDEX: DayOfWeek[] = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
];

export default async function DashboardPage() {
  const { business } = await requireOnboardedSession();
  await connectDB();

  const businessId = business._id;
  const today = WEEKDAY_INDEX[new Date().getDay()];

  const [studentCount, teacherCount, activityCount, todaySchedules] = await Promise.all([
    Student.countDocuments({ businessId, status: "active" }),
    Teacher.countDocuments({ businessId, status: "active" }),
    Activity.countDocuments({ businessId, status: "active" }),
    Schedule.find({ businessId, status: "active", daysOfWeek: today })
      .sort({ startTime: 1 })
      .populate("activityId", "name")
      .populate("teacherId", "firstName lastName")
      .lean(),
  ]);

  const stats = [
    { label: "Alumnos activos", value: studentCount, href: "/students", icon: StudentsIcon, tint: "bg-indigo-50 text-indigo-600" },
    { label: "Profesores activos", value: teacherCount, href: "/teachers", icon: TeacherIcon, tint: "bg-teal-50 text-teal-600" },
    { label: "Disciplinas", value: activityCount, href: "/activities", icon: ActivityIcon, tint: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Hola, {business.name}</h1>
        <p className="text-sm text-slate-500">Este es el resumen de tu negocio.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.href} href={stat.href}>
              <Card className="flex items-center gap-3 transition hover:border-[var(--brand-primary)] hover:shadow-md">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.tint}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-slate-900">Hoy — {DAY_LABELS[today]}</h2>
        {todaySchedules.length === 0 ? (
          <Card className="flex items-center gap-3 text-sm text-slate-500">
            <ClockIcon className="h-5 w-5 text-slate-300" />
            No hay horarios programados para hoy.
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {todaySchedules.map((schedule) => {
              const activityDoc = schedule.activityId as unknown as { name?: string } | null;
              const teacherDoc = schedule.teacherId as unknown as
                | { firstName?: string; lastName?: string }
                | null;
              return (
                <Card key={String(schedule._id)} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {schedule.title || activityDoc?.name || "Actividad"}
                    </p>
                    {teacherDoc && (
                      <p className="text-xs text-slate-500">
                        {teacherDoc.firstName} {teacherDoc.lastName}
                      </p>
                    )}
                  </div>
                  <span className="rounded-full bg-[var(--brand-primary)]/10 px-3 py-1 text-sm font-semibold text-[var(--brand-primary)]">
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
