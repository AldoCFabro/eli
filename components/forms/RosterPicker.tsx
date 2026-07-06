"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchIcon } from "@/components/ui/icons";
import { StickyBar } from "@/components/ui/StickyBar";

type RosterItem = { _id: string; label: string };

export function RosterPicker({
  items,
  initialSelectedIds,
  action,
  fieldName,
  searchPlaceholder,
  backHref,
  emptyTitle,
  emptyDescription,
}: {
  items: RosterItem[];
  initialSelectedIds: string[];
  action: (formData: FormData) => Promise<void>;
  fieldName: string;
  searchPlaceholder: string;
  backHref: string;
  emptyTitle: string;
  emptyDescription: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(() => new Set(initialSelectedIds));
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSave() {
    const formData = new FormData();
    selected.forEach((id) => formData.append(fieldName, id));
    startTransition(async () => {
      await action(formData);
      router.push(backHref);
    });
  }

  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="flex flex-col gap-3">
      <StickyBar>
        <p className="text-sm text-slate-500">{selected.size} seleccionados</p>
        <Button onClick={handleSave} disabled={pending} className="ml-auto" size="sm">
          {pending ? "Guardando..." : "Guardar"}
        </Button>
      </StickyBar>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20"
        />
      </div>

      <div className="flex flex-col divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
        {filtered.map((item) => {
          const id = item._id;
          const checked = selected.has(id);
          return (
            <label key={id} className="flex cursor-pointer items-center gap-3 px-4 py-3">
              <Avatar name={item.label} size="sm" />
              <span className="flex-1 text-sm text-slate-700">{item.label}</span>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(id)}
                className="h-4 w-4 rounded border-slate-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
              />
            </label>
          );
        })}
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-slate-400">No hay coincidencias.</p>
        )}
      </div>
    </div>
  );
}
