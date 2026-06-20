interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
  formatter?: (value: number) => string;
  labelFormatter?: (label: string) => string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
}: TooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white/95 backdrop-blur-md border border-stone-200/80 rounded-xl shadow-lifted px-3.5 py-2.5 animate-fade-in">
      <p className="text-xs text-stone-400 mb-1">
        {labelFormatter ? labelFormatter(label || '') : label}
      </p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold text-stone-900">
          {formatter ? formatter(entry.value) : entry.value.toLocaleString()}
          <span className="text-xs font-normal text-stone-400 ml-1">
            clicks
          </span>
        </p>
      ))}
    </div>
  );
}