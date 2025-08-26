// components/dashboard/OverviewStats.tsx
'use client';

import { useTranslations } from '@/lib/i18n/useTranslations';
import {
  MusicalNoteIcon,
  PlayIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

interface StatsProps {
  stats: {
    totalReleases: number;
    totalStreams: number;
    totalRevenue: number;
    lastPayment: number;
  };
}

export default function OverviewStats({ stats }: StatsProps) {
  const { t } = useTranslations();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const statItems = [
    {
      name: t.dashboard.stats.totalReleases,
      value: stats.totalReleases,
      icon: MusicalNoteIcon,
      formatter: formatNumber,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: t.dashboard.stats.totalStreams,
      value: stats.totalStreams,
      icon: PlayIcon,
      formatter: formatNumber,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: t.dashboard.stats.totalRevenue,
      value: stats.totalRevenue,
      icon: CurrencyDollarIcon,
      formatter: formatCurrency,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: t.dashboard.stats.lastPayment,
      value: stats.lastPayment,
      icon: BanknotesIcon,
      formatter: formatCurrency,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <div
          key={item.name}
          className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 py-5 shadow-sm sm:px-6 sm:py-6"
        >
          <dt>
            <div className={`absolute rounded-lg ${item.bgColor} p-3`}>
              <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              {item.name}
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">
              {item.formatter(item.value)}
            </p>
          </dd>
        </div>
      ))}
    </div>
  );
}