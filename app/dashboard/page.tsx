// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import OverviewStats from '@/components/dashboard/OverviewStats';
import RecentReleases from '@/components/dashboard/RecentReleases';
import RevenueChart from '@/components/dashboard/RevenueChart';
import TopTracks from '@/components/dashboard/TopTracks';

export default async function DashboardOverview() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Fetch user's statistics with error handling
  const [
    releasesResult,
    analyticsResult,
    paymentsResult,
    earningsResult
  ] = await Promise.allSettled([
    supabase
      .from('releases')
      .select('*')
      .eq('user_id', user.id)
      .order('release_date', { ascending: false })
      .limit(5),
    supabase
      .from('analytics')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(30),
    supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1),
    supabase
      .from('earnings')
      .select('*')
      .eq('user_id', user.id)
      .order('period_end', { ascending: false })
      .limit(12)
  ]);

  // Extract data with fallbacks
  const releases = releasesResult.status === 'fulfilled' ? releasesResult.value.data || [] : [];
  const analytics = analyticsResult.status === 'fulfilled' ? analyticsResult.value.data || [] : [];
  const payments = paymentsResult.status === 'fulfilled' ? paymentsResult.value.data || [] : [];
  const earnings = earningsResult.status === 'fulfilled' ? earningsResult.value.data || [] : [];

  // Calculate total stats
  const totalReleases = releases.length;
  const totalStreams = analytics.reduce((sum, a) => sum + (a.streams || 0), 0);
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const lastPayment = payments[0]?.amount || 0;

  const stats = {
    totalReleases,
    totalStreams,
    totalRevenue,
    lastPayment
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard Overview
          </span>
        </h1>
        <p className="mt-2 text-gray-600">
          Monitor your music distribution performance and earnings
        </p>
      </div>

      {/* Stats Grid */}
      <OverviewStats stats={stats} />

      {/* Charts and Tables Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Trend
          </h2>
          <RevenueChart earnings={earnings} />
        </div>

        {/* Top Tracks */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performing Tracks
          </h2>
          <TopTracks userId={user.id} />
        </div>
      </div>

      {/* Recent Releases */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Releases
        </h2>
        <RecentReleases releases={releases} />
      </div>
    </div>
  );
}