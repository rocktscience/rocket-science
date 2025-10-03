// components/dashboard/RevenueChart.tsx

interface RevenueChartProps {
  data?: any[]; // Make data optional
}

export default function RevenueChart({ data = [] }: RevenueChartProps) {
  // If no data, show a placeholder
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-sm">No revenue data available yet</p>
      </div>
    );
  }

  // Your existing chart rendering logic here
  return (
    <div className="h-64">
      {/* Chart implementation */}
    </div>
  );
}