'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ChartTooltip } from './chart-tooltip';
import { TimeseriesPoint } from '@/types';

interface ClicksAreaChartProps {
  data: TimeseriesPoint[];
}

export function ClicksAreaChart({ data }: ClicksAreaChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  if (formatted.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-stone-400">
        No click data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={formatted} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#049d92" stopOpacity={0.25} />
            <stop offset="50%" stopColor="#049d92" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#049d92" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e7e5e4"
          vertical={false}
        />

        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#a8a29e' }}
          dy={8}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#a8a29e' }}
          allowDecimals={false}
          dx={-4}
        />

        <Tooltip
          content={
            <ChartTooltip
              labelFormatter={(label) => label}
              formatter={(val) => val.toLocaleString()}
            />
          }
          cursor={{
            stroke: '#049d92',
            strokeWidth: 1,
            strokeDasharray: '4 4',
            strokeOpacity: 0.4,
          }}
        />

        <Area
          type="monotone"
          dataKey="clicks"
          stroke="#049d92"
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="url(#clicksGradient)"
          animationDuration={800}
          animationEasing="ease-out"
          dot={false}
          activeDot={{
            r: 5,
            fill: '#049d92',
            stroke: '#fff',
            strokeWidth: 2.5,
            className: 'drop-shadow-sm',
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}