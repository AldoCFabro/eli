import clsx from "clsx";
import { STATUS_LABELS } from "@/lib/labels";
import type { StatusValue } from "@/types";

const STATUS_CLASSES: Record<StatusValue, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-500",
  archived: "bg-amber-100 text-amber-700",
};

export function Badge({ status }: { status: StatusValue }) {
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", STATUS_CLASSES[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}
