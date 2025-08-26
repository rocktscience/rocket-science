// app/dashboard/recordings/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Plus, Trash2, Upload, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from '@/app/providers/TranslationProvider';

interface Track {
  title: string;
  artist: string;
  duration: string;
  isrc: string;
}

export default function NewReleasePage() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslations();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    label: '',
    upc: '',
    release_date: '',
    genre: '',
    language: 'English',
    explicit: false,
  });
  
  const [tracks, setTracks] = useState<Track[]>([
    { title: '', artist: '', duration: '', isrc: '' }
  ]);

  const handleAddTrack = () => {
    setTracks([...tracks, { title: '', artist: '', duration: '', isrc: '' }]);
  };

  const handleRemoveTrack = (index: number) => {
    if (tracks.length > 1) {
      setTracks(tracks.filter((_, i) => i !== index));
    }
  };

  const handleTrackChange = (index: number, field: keyof Track, value: string) => {
    const updatedTracks = [...tracks];
    updatedTracks[index][field] = value;
    setTracks(updatedTracks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Create release
      const { data: release, error: releaseError } = await supabase
        .from('releases')
        .insert({
          user_id: user.id,
          title: formData.title,
          artist: formData.artist,
          label: formData.label,
          upc: formData.upc,
          release_date: formData.release_date,
          genre: formData.genre,
          language: formData.language,
          explicit: formData.explicit,
          status: 'draft',
        })
        .select()
        .single();

      if (releaseError) throw releaseError;

      // Create tracks
      if (release) {
        const tracksData = tracks.map((track, index) => ({
          release_id: release.id,
          title: track.title,
          artist: track.artist || formData.artist,
          duration: track.duration,
          isrc: track.isrc,
          track_number: index + 1,
        }));

        const { error: tracksError } = await supabase
          .from('tracks')
          .insert(tracksData);

        if (tracksError) throw tracksError;
      }

      router.push('/dashboard/recordings');
    } catch (error) {
      console.error('Error creating release:', error);
      alert('Error creating release. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/recordings"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Recordings
          </Link>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {t.dashboard?.newRelease || 'New Release'}
            </span>
          </h1>
          <p className="mt-2 text-gray-600">
            Create a new release for distribution
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Release Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Release Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Release Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Album or single title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Artist *
              </label>
              <input
                type="text"
                required
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Artist name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Record label (optional)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Release Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.release_date}
                  onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre *
              </label>
              <select
                required
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">Select genre</option>
                <option value="pop">Pop</option>
                <option value="rock">Rock</option>
                <option value="hip-hop">Hip Hop</option>
                <option value="electronic">Electronic</option>
                <option value="r&b">R&B</option>
                <option value="country">Country</option>
                <option value="latin">Latin</option>
                <option value="jazz">Jazz</option>
                <option value="classical">Classical</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.explicit}
                onChange={(e) => setFormData({ ...formData, explicit: e.target.checked })}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-sm text-gray-700">This release contains explicit content</span>
            </label>
          </div>
        </div>

        {/* Tracks */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Tracks</h2>
            <button
              type="button"
              onClick={handleAddTrack}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Plus className="h-4 w-4" />
              Add Track
            </button>
          </div>
          
          <div className="space-y-4">
            {tracks.map((track, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Track {index + 1}</h3>
                  {tracks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTrack(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Track Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={track.title}
                      onChange={(e) => handleTrackChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Track Artist
                    </label>
                    <input
                      type="text"
                      value={track.artist}
                      onChange={(e) => handleTrackChange(index, 'artist', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder={formData.artist || 'Same as primary artist'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={track.duration}
                      onChange={(e) => handleTrackChange(index, 'duration', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="0:00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      ISRC
                    </label>
                    <input
                      type="text"
                      value={track.isrc}
                      onChange={(e) => handleTrackChange(index, 'isrc', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/recordings"
            className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Release'}
          </button>
        </div>
      </form>
    </div>
  );
}