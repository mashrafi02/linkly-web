interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: React.ReactNode;
}

export function StatCard({ label, value, sublabel, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 hover:shadow-soft transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm text-stone-500">{label}</span>
        <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-stone-900 tabular-nums">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {sublabel && (
        <p className="text-xs text-stone-400 mt-1">{sublabel}</p>
      )}
    </div>
  );
}