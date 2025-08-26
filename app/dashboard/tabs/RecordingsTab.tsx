// app/dashboard/tabs/RecordingsTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Search, Filter, Edit, Trash2, Eye, Music } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from '@/app/providers/TranslationProvider';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'client' | 'viewer';
  services: string[];
  assigned_to?: string;
}

interface Recording {
  id: string;
  user_id: string;
  title: string;
  artist: string;
  status: string;
  release_date: string;
  created_at: string;
  upc?: string;
  label?: string;
  user?: {
    full_name: string;
    email: string;
  };
}

interface RecordingsTabProps {
  profile: Profile;
  isViewer: boolean;
}

export default function RecordingsTab({ profile, isViewer }: RecordingsTabProps) {
  const supabase = createClient();
  const { t } = useTranslations();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchRecordings();
  }, [profile, filterStatus]);

  const fetchRecordings = async () => {
    try {
      let query = supabase
        .from('releases')
        .select(`
          *,
          user:profiles!user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // Add search filter
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,artist.ilike.%${searchTerm}%`);
      }

      // Add status filter
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recordings:', error);
      } else {
        setRecordings(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (recordingId: string, newStatus: string) => {
    if (isViewer) return;

    const { error } = await supabase
      .from('releases')
      .update({ status: newStatus })
      .eq('id', recordingId);

    if (!error) {
      fetchRecordings();
    }
  };

  const handleDelete = async (recordingId: string) => {
    if (isViewer) return;
    
    if (!confirm(t.dashboard?.confirmDelete || 'Are you sure you want to delete this recording?')) return;

    const { error } = await supabase
      .from('releases')
      .delete()
      .eq('id', recordingId);

    if (!error) {
      fetchRecordings();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecordings();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">{t.common?.loading || 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {t.dashboard?.recordings || 'Recordings'}
          </span>
        </h1>
        <p className="mt-2 text-gray-600">
          {t.dashboard?.recordingsSubtitle || 'Manage your music releases and distribution'}
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t.dashboard?.searchRecordings || "Search recordings..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </form>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="all">{t.dashboard?.allStatus || 'All Status'}</option>
            <option value="draft">{t.dashboard?.draft || 'Draft'}</option>
            <option value="submitted">{t.dashboard?.submitted || 'Submitted'}</option>
            <option value="approved">{t.dashboard?.approved || 'Approved'}</option>
            <option value="released">{t.dashboard?.released || 'Released'}</option>
          </select>
        </div>
        
        {!isViewer && (
          <Link
            href="/dashboard/releases/new"
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-2 text-sm font-medium text-white shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            {t.dashboard?.newRelease || 'New Release'}
          </Link>
        )}
      </div>

      {/* Recordings Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.dashboard?.title || 'Title'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.dashboard?.artist || 'Artist'}
                </th>
                {profile.role === 'admin' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.dashboard?.user || 'User'}
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.dashboard?.status || 'Status'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.dashboard?.releaseDate || 'Release Date'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.dashboard?.actions || 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recordings.map((recording) => (
                <tr key={recording.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Music className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{recording.title}</div>
                        {recording.upc && (
                          <div className="text-xs text-gray-500">UPC: {recording.upc}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{recording.artist}</div>
                    {recording.label && (
                      <div className="text-xs text-gray-500">{recording.label}</div>
                    )}
                  </td>
                  {profile.role === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{recording.user?.full_name}</div>
                      <div className="text-xs text-gray-500">{recording.user?.email}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isViewer ? (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${recording.status === 'released' ? 'bg-green-100 text-green-800' : 
                          recording.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                          recording.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {recording.status}
                      </span>
                    ) : (
                      <select
                        value={recording.status}
                        onChange={(e) => handleStatusChange(recording.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        disabled={profile.role === 'client' && ['approved', 'released'].includes(recording.status)}
                      >
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        {profile.role === 'admin' && <option value="approved">Approved</option>}
                        {profile.role === 'admin' && <option value="released">Released</option>}
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {recording.release_date ? new Date(recording.release_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {isViewer ? (
                        <button className="text-gray-600 hover:text-gray-900 transition">
                          <Eye className="w-5 h-5" />
                        </button>
                      ) : (
                        <>
                          <button className="text-gray-600 hover:text-gray-900 transition">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(recording.id)}
                            className="text-red-600 hover:text-red-900 transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {recordings.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {t.dashboard?.noRecordings || 'No recordings found'}
          </div>
        )}
      </div>
    </div>
  );
}