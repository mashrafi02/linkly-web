'use client';

import { ClickBreakdown } from '@/types';

interface BarListProps {
  data: ClickBreakdown[];
  maxItems?: number;
}

export function BarList({ data, maxItems = 8 }: BarListProps) {
  const items = data.slice(0, maxItems);
  const maxVal = Math.max(...items.map((d) => d.clicks), 1);

  if (items.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-stone-400">
        No data yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={item.label} className="group">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-stone-700 truncate max-w-[70%]">
              {item.label === 'unknown' ? (
                <span className="text-stone-400 italic">Direct / Unknown</span>
              ) : (
                item.label
              )}
            </span>
            <span className="text-sm font-medium text-stone-900 tabular-nums">
              {item.clicks.toLocaleString()}
            </span>
          </div>
          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${(item.clicks / maxVal) * 100}%`,
                background:
                  i === 0
                    ? '#049d92'
                    : i === 1
                      ? '#22dfca'
                      : i === 2
                        ? '#087d76'
                        : '#d6d3d1',
                animationDelay: `${i * 80}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}