// components/dashboard/RecentReleases.tsx
'use client';

import { useTranslations } from '@/app/providers/TranslationProvider';
import Link from 'next/link';
import Image from 'next/image';

interface Release {
  id: string;
  title: string;
  artist: string;
  release_date: string;
  status: string;
  cover_url?: string;
  upc?: string;
}

interface RecentReleasesProps {
  releases: Release[];
}

export default function RecentReleases({ releases }: RecentReleasesProps) {
  const { t } = useTranslations();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'released':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (releases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t.dashboard?.noReleases || 'No releases yet'}</p>
        <Link
          href="/dashboard/releases/new"
          className="mt-4 inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          {t.dashboard?.createRelease || 'Create First Release'}
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t.dashboard?.release || 'RELEASE'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t.dashboard?.releaseDate || 'RELEASE DATE'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                {t.dashboard?.status?.released || 'STATUS'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                UPC
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">{t.dashboard?.actions || 'Actions'}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {releases.map((release) => (
              <tr key={release.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {release.cover_url ? (
                        <Image
                          className="h-10 w-10 rounded-lg object-cover"
                          src={release.cover_url}
                          alt={release.title}
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-200" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {release.title}
                      </div>
                      <div className="text-sm text-gray-500">{release.artist}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {formatDate(release.release_date)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                      release.status
                    )}`}
                  >
                    {t.dashboard?.status?.[release.status as keyof typeof t.dashboard.status] || release.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {release.upc || '-'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/dashboard/releases/${release.id}`}
                    className="text-gray-900 hover:text-gray-700"
                  >
                    {t.dashboard?.view || 'View'}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <Link
          href="/dashboard/releases"
          className="text-sm font-medium text-gray-900 hover:text-gray-700"
        >
          {t.dashboard?.viewAllReleases || 'View all releases'} →
        </Link>
      </div>
    </div>
  );
}