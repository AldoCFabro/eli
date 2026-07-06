"use client";

import { useTransition } from "react";
import clsx from "clsx";
import { STATUS_LABELS } from "@/lib/labels";
import { STATUS_VALUES, type StatusValue } from "@/types";

const STATUS_CLASSES: Record<StatusValue, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-500",
  archived: "bg-amber-100 text-amber-700",
};

export function StatusMenu({
  status,
  onChange,
}: {
  status: StatusValue;
  onChange: (status: StatusValue) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as StatusValue;
        startTransition(() => onChange(next));
      }}
      className={clsx(
        "h-8 cursor-pointer appearance-none rounded-full border-0 py-0 pl-3 pr-7 text-xs font-medium outline-none disabled:cursor-wait disabled:opacity-60",
        STATUS_CLASSES[status]
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%2364748b' stroke-width='1.8'><path d='m6 8 4 4 4-4' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.4rem center",
        backgroundSize: "1rem",
      }}
    >
      {STATUS_VALUES.map((value) => (
        <option key={value} value={value}>
          {STATUS_LABELS[value]}
        </option>
      ))}
    </select>
  );
}
