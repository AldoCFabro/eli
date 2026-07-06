export function StickyBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-14 z-20 -mx-4 flex items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
      {children}
    </div>
  );
}
