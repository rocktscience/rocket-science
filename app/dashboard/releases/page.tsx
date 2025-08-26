// app/dashboard/releases/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Plus, Music } from 'lucide-react';
import Link from 'next/link';

export default async function ReleasesPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/login');
  }

  // Check access based on role and services
  const hasAccess = profile.role === 'admin' || 
                    profile.services?.includes('distribution') ||
                    profile.services?.includes('label') ||
                    profile.role === 'viewer';

  if (!hasAccess) {
    redirect('/dashboard');
  }

  // Fetch releases based on role
  let releasesQuery = supabase
    .from('releases')
    .select(`
      *,
      tracks (
        id,
        title,
        artist,
        duration,
        track_number
      )
    `)
    .order('created_at', { ascending: false });

  // If not admin, only show user's own releases
  if (profile.role !== 'admin') {
    releasesQuery = releasesQuery.eq('user_id', user.id);
  }

  const { data: releases } = await releasesQuery;
  const isViewer = profile.role === 'viewer';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Releases
            </span>
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your music releases and tracks
          </p>
        </div>
        {!isViewer && (
          <Link
            href="/dashboard/releases/new"
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-2 text-sm font-medium text-white shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            New Release
          </Link>
        )}
      </div>

      {/* Releases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {releases?.map((release) => (
          <div key={release.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <Music className="h-10 w-10 text-gray-400" />
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                ${release.status === 'released' ? 'bg-green-100 text-green-800' : 
                  release.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                  release.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'}`}>
                {release.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {release.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{release.artist}</p>
            <p className="text-xs text-gray-500 mb-4">
              {release.tracks?.length || 0} tracks • {new Date(release.release_date).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              <Link
                href={`/dashboard/releases/${release.id}`}
                className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                View Details
              </Link>
              {!isViewer && (
                <Link
                  href={`/dashboard/releases/${release.id}/edit`}
                  className="flex-1 text-center px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                >
                  Edit
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {(!releases || releases.length === 0) && (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No releases found</p>
          {!isViewer && (
            <Link
              href="/dashboard/releases/new"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-2 text-sm font-medium text-white shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Your First Release
            </Link>
          )}
        </div>
      )}
    </div>
  );
}