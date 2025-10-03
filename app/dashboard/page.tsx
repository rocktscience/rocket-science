// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Music, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Eye,
  Plus,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useTranslations } from '@/app/providers/TranslationProvider';
import { useUser } from '@/app/providers/UserProvider';
import RevenueChart from '@/components/dashboard/RevenueChart';

interface Release {
  id: string;
  title: string;
  artist: string;
  release_date: string;
  status: string;
  cover_url?: string;
  upc?: string;
}

interface Composition {
  id: string;
  title: string;
  iswc?: string;
  status: string;
  created_at: string;
  writers?: any[];
}

interface DashboardStats {
  totalReleases: number;
  totalCompositions: number;
  totalStreams: number;
  totalRevenue: number;
  pendingPayments: number;
  activeContracts: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { t } = useTranslations();
  const { user, profile } = useUser();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalReleases: 0,
    totalCompositions: 0,
    totalStreams: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    activeContracts: 0
  });
  const [recentReleases, setRecentReleases] = useState<Release[]>([]);
  const [recentCompositions, setRecentCompositions] = useState<Composition[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  const isAdmin = profile?.role === 'admin';
  const hasDistribution = profile?.services?.includes('distribution') || profile?.services?.includes('label');
  const hasPublishing = profile?.services?.includes('publishing');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadRecentReleases(),
        loadRecentCompositions(),
        loadRevenueData()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!user) return;

    try {
      // Get releases count
      let releasesQuery = supabase
        .from('releases')
        .select('id', { count: 'exact', head: true });
      
      if (!isAdmin) {
        releasesQuery = releasesQuery.eq('user_id', user.id);
      }
      
      const { count: releasesCount } = await releasesQuery;

      // Get compositions count
      let compositionsQuery = supabase
        .from('compositions')
        .select('id', { count: 'exact', head: true });
      
      if (!isAdmin) {
        compositionsQuery = compositionsQuery.eq('user_id', user.id);
      }
      
      const { count: compositionsCount } = await compositionsQuery;

      // Get analytics data for streams and revenue
      let analyticsQuery = supabase
        .from('analytics')
        .select('streams, revenue');
      
      if (!isAdmin) {
        analyticsQuery = analyticsQuery.eq('user_id', user.id);
      }
      
      const { data: analyticsData } = await analyticsQuery;
      
      const totalStreams = analyticsData?.reduce((sum, item) => sum + (item.streams || 0), 0) || 0;
      const totalRevenue = analyticsData?.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0) || 0;

      // Get pending payments
      let paymentsQuery = supabase
        .from('payments')
        .select('amount')
        .eq('status', 'pending');
      
      if (!isAdmin) {
        paymentsQuery = paymentsQuery.eq('user_id', user.id);
      }
      
      const { data: pendingPaymentsData } = await paymentsQuery;
      const pendingPayments = pendingPaymentsData?.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0) || 0;

      // Get active contracts count
      let contractsQuery = supabase
        .from('contracts')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active');
      
      if (!isAdmin) {
        contractsQuery = contractsQuery.eq('user_id', user.id);
      }
      
      const { count: contractsCount } = await contractsQuery;

      setStats({
        totalReleases: releasesCount || 0,
        totalCompositions: compositionsCount || 0,
        totalStreams,
        totalRevenue,
        pendingPayments,
        activeContracts: contractsCount || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecentReleases = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('releases')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      if (data) {
        setRecentReleases(data);
      }
    } catch (error) {
      console.error('Error loading recent releases:', error);
    }
  };

  const loadRecentCompositions = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('compositions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      if (data) {
        setRecentCompositions(data);
      }
    } catch (error) {
      console.error('Error loading recent compositions:', error);
    }
  };

  const loadRevenueData = async () => {
    if (!user) return;

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      let query = supabase
        .from('analytics')
        .select('date, revenue, streams')
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });
      
      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      if (data) {
        // Group by date
        const grouped = data.reduce((acc, item) => {
          const date = item.date;
          if (!acc[date]) {
            acc[date] = { date, revenue: 0, streams: 0 };
          }
          acc[date].revenue += parseFloat(item.revenue) || 0;
          acc[date].streams += item.streams || 0;
          return acc;
        }, {} as Record<string, any>);
        
        setRevenueData(Object.values(grouped));
      }
    } catch (error) {
      console.error('Error loading revenue data:', error);
    }
  };

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
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {t.welcomeBack || 'Welcome back'}, {profile?.full_name || profile?.entity_name}!
        </h1>
        <p className="text-gray-300">
          {isAdmin ? 'System Overview' : 'Here\'s your catalog overview'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hasDistribution && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Music className="w-8 h-8 text-gray-400" />
              <span className="text-xs text-gray-500 uppercase">{t.releases || 'Releases'}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalReleases}</div>
            <p className="text-sm text-gray-500 mt-1">Total releases</p>
          </div>
        )}

        {hasPublishing && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Music className="w-8 h-8 text-gray-400" />
              <span className="text-xs text-gray-500 uppercase">{t.compositions || 'Compositions'}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalCompositions}</div>
            <p className="text-sm text-gray-500 mt-1">Registered works</p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
            <span className="text-xs text-gray-500 uppercase">Streams</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalStreams.toLocaleString()}
          </div>
          <p className="text-sm text-gray-500 mt-1">Total plays</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-gray-400" />
            <span className="text-xs text-gray-500 uppercase">Revenue</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${stats.totalRevenue.toFixed(2)}
          </div>
          <p className="text-sm text-gray-500 mt-1">Total earnings</p>
        </div>
      </div>

      {/* Revenue Chart */}
      {revenueData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Trends</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm">Revenue data coming soon with LAUNCHPAD</p>
        </div>
</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Releases */}
        {hasDistribution && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Releases</h2>
              <Link
                href="/dashboard/releases"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                View all →
              </Link>
            </div>
            
            {recentReleases.length === 0 ? (
              <div className="text-center py-8">
                <Music className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No releases yet</p>
                <Link
                  href="/dashboard/releases/new"
                  className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Release
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReleases.map((release) => (
                  <Link
                    key={release.id}
                    href={`/dashboard/releases/${release.id}`}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex items-center space-x-3">
                      {release.cover_url ? (
                        <img
                          src={release.cover_url}
                          alt={release.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Music className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{release.title}</p>
                        <p className="text-xs text-gray-500">{release.artist}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(release.status)}`}>
                      {release.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent Compositions */}
        {hasPublishing && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Compositions</h2>
              <Link
                href="/dashboard/compositions"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                View all →
              </Link>
            </div>
            
            {recentCompositions.length === 0 ? (
              <div className="text-center py-8">
                <Music className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No compositions yet</p>
                <Link
                  href="/dashboard/compositions/new"
                  className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Register First Work
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCompositions.map((composition) => (
                  <Link
                    key={composition.id}
                    href={`/dashboard/compositions/${composition.id}`}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{composition.title}</p>
                      <p className="text-xs text-gray-500">
                        {composition.iswc || 'No ISWC'} • {formatDate(composition.created_at)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(composition.status)}`}>
                      {composition.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hasDistribution && (
            <Link
              href="/dashboard/releases/new"
              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition"
            >
              <Plus className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-gray-900 font-medium">New Release</span>
            </Link>
          )}
          
          {hasPublishing && (
            <Link
              href="/dashboard/compositions/new"
              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition"
            >
              <Plus className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-gray-900 font-medium">Register Work</span>
            </Link>
          )}
          
          <Link
            href="/dashboard/analytics"
            className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition"
          >
            <Eye className="w-5 h-5 text-gray-600 mr-3" />
            <span className="text-gray-900 font-medium">View Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
}