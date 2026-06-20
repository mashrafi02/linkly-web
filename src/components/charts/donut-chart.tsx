'use client';

import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  PieSectorDataItem,
} from 'recharts';
import { ClickBreakdown } from '@/types';

const COLORS = [
  '#049d92', // brand teal
  '#087d76', // darker teal
  '#22dfca', // light teal
  '#EF9F27', // amber
  '#D85A30', // coral
  '#7F77DD', // purple
  '#378ADD', // blue
  '#d6d3d1', // stone (for "other")
];

interface DonutChartProps {
  data: ClickBreakdown[];
  label: string;
}

// Custom active shape for hover
function ActiveShape(props: PieSectorDataItem) {
  const {
    cx, cy, innerRadius, outerRadius,
    startAngle, endAngle, fill, payload, value,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={4}
      />
      {/* Center text */}
      <text x={cx} y={cy - 8} textAnchor="middle" className="fill-stone-900 text-sm font-semibold">
        {value}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" className="fill-stone-400 text-xs">
        {payload.label}
      </text>
    </g>
  );
}

export function DonutChart({ data, label }: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // Take top 6, group rest as "Other"
  const top = data.slice(0, 6);
  const restTotal = data.slice(6).reduce((sum, d) => sum + d.clicks, 0);
  const chartData = restTotal > 0
    ? [...top, { label: 'Other', clicks: restTotal }]
    : top;

  const total = chartData.reduce((sum, d) => sum + d.clicks, 0);

  if (total === 0) {
    return (
      <div aria-label={label} className="h-full flex flex-col items-center justify-center text-sm text-stone-400">
        <div className="w-20 h-20 rounded-full border-4 border-stone-100 mb-3" />
        No data yet
      </div>
    );
  }

  return (
    <div aria-label={label} className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={3}
              dataKey="clicks"
              nameKey="label"
              strokeWidth={0}
              cornerRadius={4}
              animationDuration={800}
              animationEasing="ease-out"
              activeShape={ActiveShape}
              onMouseEnter={(_, i) => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  className="transition-opacity duration-200"
                  opacity={activeIndex !== undefined && activeIndex !== i ? 0.4 : 1}
                />
              ))}
            </Pie>

            {/* Default center text (when nothing hovered) */}
            {activeIndex === undefined && (
              <>
                <text x="50%" y="46%" textAnchor="middle" className="fill-stone-900 text-lg font-semibold">
                  {total}
                </text>
                <text x="50%" y="56%" textAnchor="middle" className="fill-stone-400 text-xs">
                  total
                </text>
              </>
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center pt-2">
        {chartData.slice(0, 5).map((d, i) => (
          <div
            key={d.label}
            className="flex items-center gap-1.5 cursor-default"
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(undefined)}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="text-xs text-stone-500 truncate max-w-20">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}