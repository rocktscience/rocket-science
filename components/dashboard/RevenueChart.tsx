// components/dashboard/RevenueChart.tsx
'use client';

import { useTranslations } from '@/lib/i18n/useTranslations';
import { useMemo } from 'react';

interface Earning {
  id: string;
  period_start: string;
  period_end: string;
  amount: number | null | undefined;
}

interface RevenueChartProps {
  earnings: Earning[] | null | undefined;
}

export default function RevenueChart({ earnings }: RevenueChartProps) {
  const { t } = useTranslations();

  const chartData = useMemo(() => {
    // Handle null, undefined, or non-array earnings
    if (!earnings || !Array.isArray(earnings)) {
      return [];
    }

    // Filter out invalid entries and ensure amount is a number
    return earnings
      .filter((earning) => {
        return earning && 
               earning.period_end && 
               typeof earning.amount === 'number' && 
               !isNaN(earning.amount);
      })
      .sort((a, b) => new Date(a.period_end).getTime() - new Date(b.period_end).getTime())
      .map((earning) => ({
        date: new Date(earning.period_end).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        amount: earning.amount as number, // TypeScript now knows this is a number
      }));
  }, [earnings]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">{t.dashboard?.revenueChart?.noData || 'No revenue data available'}</p>
      </div>
    );
  }

  // Safely calculate max and min with fallbacks
  const amounts = chartData.map((d) => d.amount);
  const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0;
  const minAmount = amounts.length > 0 ? Math.min(...amounts) : 0;
  const range = maxAmount - minAmount || 1;

  return (
    <div className="h-64">
      <div className="relative h-full">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-xs text-gray-500">
          <span>${(maxAmount / 1000).toFixed(1)}k</span>
          <span>${(minAmount / 1000).toFixed(1)}k</span>
        </div>

        {/* Chart area */}
        <div className="ml-12 h-full">
          <svg className="h-full w-full" preserveAspectRatio="none">
            {/* Grid lines */}
            <g className="text-gray-200">
              {[0, 0.25, 0.5, 0.75, 1].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={`${y * 100}%`}
                  x2="100%"
                  y2={`${y * 100}%`}
                  stroke="currentColor"
                  strokeDasharray="4 4"
                />
              ))}
            </g>

            {/* Line chart */}
            {chartData.length > 1 && (
              <polyline
                fill="none"
                stroke="rgb(0, 0, 0)"
                strokeWidth="2"
                points={chartData
                  .map((d, i) => {
                    const x = (i / (chartData.length - 1)) * 100;
                    const y = ((maxAmount - d.amount) / range) * 100;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            )}

            {/* Data points */}
            {chartData.map((d, i) => {
              const x = chartData.length > 1 
                ? (i / (chartData.length - 1)) * 100 
                : 50; // Center single point
              const y = ((maxAmount - d.amount) / range) * 100;
              return (
                <circle
                  key={i}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill="rgb(0, 0, 0)"
                  className="hover:r-6 transition-all cursor-pointer"
                >
                  <title>{`${d.date}: $${d.amount.toLocaleString()}`}</title>
                </circle>
              );
            })}
          </svg>

          {/* X-axis labels */}
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            {chartData.filter((_, i) => {
              // Show fewer labels if there are many data points
              const showEvery = Math.ceil(chartData.length / 4);
              return i % showEvery === 0 || i === chartData.length - 1;
            }).map((d, i) => (
              <span key={`${d.date}-${i}`}>{d.date}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}