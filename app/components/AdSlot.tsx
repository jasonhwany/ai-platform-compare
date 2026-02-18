type AdSlotProps = {
  id: string;
  label?: string;
  className?: string;
};

export default function AdSlot({
  id,
  label = "Ad Slot Placeholder",
  className = "",
}: AdSlotProps) {
  return (
    <div
      id={id}
      data-ad-slot={id}
      className={`min-h-[120px] rounded-xl border border-dashed border-slate-700/80 bg-slate-900/60 ${className}`.trim()}
      aria-label={label}
    >
      {/* TODO: Inject Google AdSense container and script bindings here. */}
      {/* TODO: Replace this placeholder with responsive ad unit markup. */}
      <div className="flex min-h-[120px] items-center justify-center px-4 text-center text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </div>
    </div>
  );
}
