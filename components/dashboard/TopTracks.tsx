// components/dashboard/TopTracks.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from '@/lib/i18n/useTranslations';

interface Track {
  id: string;
  title: string;
  artist: string;
  streams: number;
  revenue: number;
}

interface TopTracksProps {
  userId: string;
}

export default function TopTracks({ userId }: TopTracksProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslations();
  const supabase = createClient();

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        // Fetch tracks with their analytics data
        const { data: trackData } = await supabase
          .from('tracks')
          .select(`
            id,
            title,
            artist,
            release_id,
            analytics (
              streams,
              revenue
            )
          `)
          .eq('user_id', userId)
          .order('analytics.streams', { ascending: false })
          .limit(5);

        if (trackData) {
          const formattedTracks = trackData.map((track: any) => ({
            id: track.id,
            title: track.title,
            artist: track.artist,
            streams: track.analytics?.reduce((sum: number, a: any) => sum + a.streams, 0) || 0,
            revenue: track.analytics?.reduce((sum: number, a: any) => sum + a.revenue, 0) || 0,
          }));

          setTracks(formattedTracks);
        }
      } catch (error) {
        console.error('Error fetching top tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopTracks();
  }, [userId, supabase]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded" />
        ))}
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{t.dashboard.topTracks.noData}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-900">
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900">{track.title}</p>
              <p className="text-sm text-gray-500">{track.artist}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {track.streams.toLocaleString()} {t.dashboard.topTracks.streams}
            </p>
            <p className="text-sm text-gray-500">
              ${track.revenue.toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}