const PALETTE = [
  "bg-indigo-100 text-indigo-700",
  "bg-teal-100 text-teal-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-fuchsia-100 text-fuchsia-700",
];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function Avatar({
  name,
  size = "md",
  shape = "circle",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square";
}) {
  const palette = PALETTE[hashString(name) % PALETTE.length];
  const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-12 w-12 text-base" : "h-10 w-10 text-sm";
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-xl";

  return (
    <div className={`flex shrink-0 items-center justify-center font-semibold ${sizeClass} ${shapeClass} ${palette}`}>
      {initials(name) || "?"}
    </div>
  );
}
