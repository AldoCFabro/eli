"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { SearchIcon } from "@/components/ui/icons";

type RosterItem = { _id: string; label: string };

export function RosterPreview({
  items,
  emptyLabel,
  hrefBase,
}: {
  items: RosterItem[];
  emptyLabel: string;
  hrefBase?: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, query]);

  if (items.length === 0) {
    return <p className="text-sm text-slate-500">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {items.length > 5 && (
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en la lista..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20"
          />
        </div>
      )}
      <ul className="flex flex-col divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
        {filtered.map((item) => {
          const id = item._id;
          const content = (
            <div className="flex items-center gap-3 px-4 py-2.5">
              <Avatar name={item.label} size="sm" />
              <span className="text-sm text-slate-700">{item.label}</span>
            </div>
          );
          return (
            <li key={id}>
              {hrefBase ? (
                <Link href={`${hrefBase}/${id}`} className="block transition hover:bg-slate-50">
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-slate-400">No hay coincidencias.</li>
        )}
      </ul>
    </div>
  );
}
