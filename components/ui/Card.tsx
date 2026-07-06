import clsx from "clsx";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow", className)}
      {...props}
    />
  );
}
