'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Upload, X, AlertCircle, Music2, Play, Pause } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useTranslations } from '@/app/providers/TranslationProvider';
import { 
  countries,
  territories, 
  genreSubgenreMap,
  musicLanguages,
  performerRoles,
  productionRoles
} from '@/lib/constants/musicData';
import Waveform from '@/components/Waveform';

interface Track {
  id: string;
  title: string;
  version: string;
  explicit: 'Clean' | 'Explicit' | 'Not Explicit';
  isrc: string;
  language: string;
  genre: string;
  subgenre: string;
  audioFile: File | null;
  duration: string;
  writers: Array<{
    id: string;
    name: string;
    role: 'Adapter' | 'Arranger' | 'Composer' | 'Librettist' | 'Lyricist' | 'Songwriter' | 'Transcriber' | 'Vocal Adaptation';
  }>;
  performers: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  production: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  isHiRes?: boolean;
  isLossless?: boolean;
}

export default function NewReleasePage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { t } = useTranslations();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isVariousArtists, setIsVariousArtists] = useState(false);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  
  // Basic Information
  const [title, setTitle] = useState('');
  const [artists, setArtists] = useState<string[]>(['']);
  const [featuredArtists, setFeaturedArtists] = useState<string[]>(['']);
  const [label, setLabel] = useState('');
  const [upc, setUpc] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [originalReleaseDate, setOriginalReleaseDate] = useState('');
  const [catalogNumber, setCatalogNumber] = useState('');
  const [genre, setGenre] = useState('');
  const [pLine, setPLine] = useState(`${new Date().getFullYear()} `);
  const [cLine, setCLine] = useState('');
  const [coverArt, setCoverArt] = useState<File | null>(null);
  const [coverArtError, setCoverArtError] = useState('');
  const [artistProfiles, setArtistProfiles] = useState<{spotify?: string; appleMusic?: string; hasProfile: boolean}>({
    hasProfile: false
  });
  
  // Tracks
  const [tracks, setTracks] = useState<Track[]>([]);

  const validateCoverArt = (file: File): boolean => {
    setCoverArtError('');
    
    // Check file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setCoverArtError('Only .jpg, .jpeg, and .png formats are accepted');
      return false;
    }
    
    // Check file size (optional, but good practice)
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setCoverArtError('File size must be less than 10MB');
      return false;
    }
    
    // Check dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width !== img.height) {
        setCoverArtError('Cover art must be square (same width and height)');
        setCoverArt(null);
        setPreviewUrl(null);
        return false;
      }
      if (img.width < 1000 || img.height < 1000) {
        setCoverArtError('Minimum size is 1000x1000 pixels');
        setCoverArt(null);
        setPreviewUrl(null);
        return false;
      }
    };
    
    return true;
  };

  const handleCoverArtUpload = (file: File) => {
    if (validateCoverArt(file)) {
      setCoverArt(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCoverDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleCoverArtUpload(file);
    }
  }, []);

  const handleCoverDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleCoverDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleAddArtist = () => {
    const newArtists = [...artists, ''];
    setArtists(newArtists);
    
    // Auto-convert to Various Artists if 5+ artists
    if (newArtists.length >= 5) {
      setIsVariousArtists(true);
    }
  };

  const handleRemoveArtist = (index: number) => {
    const newArtists = artists.filter((_, i) => i !== index);
    setArtists(newArtists);
    
    // Check if still qualifies for Various Artists
    if (newArtists.length < 5) {
      setIsVariousArtists(false);
    }
  };

  const handleAddTrack = () => {
    const newTrack: Track = {
      id: Date.now().toString(),
      title: '',
      version: '',
      explicit: 'Not Explicit',
      isrc: '',
      language: '',
      genre: '',
      subgenre: '',
      audioFile: null,
      duration: '',
      writers: [{
        id: Date.now().toString(),
        name: '',
        role: 'Songwriter'
      }],
      performers: [{
        id: Date.now().toString(),
        name: '',
        role: 'Lead Vocals'
      }],
      production: [{
        id: Date.now().toString(),
        name: '',
        role: 'Producer'
      }]
    };
    setTracks([...tracks, newTrack]);
  };

  const validateAudioFile = (file: File): boolean => {
    const validTypes = ['audio/aiff', 'audio/x-aiff', 'audio/flac', 'audio/wav', 'audio/x-wav'];
    
    if (!validTypes.includes(file.type)) {
      alert('Only .aiff, .flac, and .wav files are accepted');
      return false;
    }
    
    // Note: Sample rate and bit depth validation would require Web Audio API processing
    // This would be done in the Waveform component
    
    return true;
  };

  const handleTrackAudioUpload = (trackIndex: number, file: File) => {
    if (!validateAudioFile(file)) return;
    
    const updated = [...tracks];
    updated[trackIndex].audioFile = file;
    
                    // Audio analysis will be handled by the Waveform component
    
    setTracks(updated);
  };

  const validateUPC = (value: string): boolean => {
    // Remove any non-digits
    const digits = value.replace(/\D/g, '');
    
    // Check if it's 12 digits (UPC) or 13 digits (EAN)
    if (digits.length !== 12 && digits.length !== 13) {
      return false;
    }
    
    return true;
  };

  const validateISRC = (value: string): boolean => {
    // ISRC Format: CC-XXX-YY-NNNNN
    // Example: US-RRR-20-12345
    const isrcRegex = /^[A-Z]{2}[A-Z0-9]{3}\d{2}\d{5}$/;
    const cleanValue = value.replace(/-/g, '').toUpperCase();
    
    return isrcRegex.test(cleanValue);
  };

  const formatISRC = (value: string): string => {
    const clean = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    if (clean.length <= 2) return clean;
    if (clean.length <= 5) return `${clean.slice(0, 2)}-${clean.slice(2)}`;
    if (clean.length <= 7) return `${clean.slice(0, 2)}-${clean.slice(2, 5)}-${clean.slice(5)}`;
    return `${clean.slice(0, 2)}-${clean.slice(2, 5)}-${clean.slice(5, 7)}-${clean.slice(7, 12)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate UPC
    if (!validateUPC(upc)) {
      setError('UPC must be 12 digits (or 13 for EAN)');
      setLoading(false);
      return;
    }

    // Validate cover art
    if (!coverArt) {
      setError('Cover art is required');
      setLoading(false);
      return;
    }

    // Validate tracks
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (!validateISRC(track.isrc)) {
        setError(`Track ${i + 1}: Invalid ISRC format (should be CCXXXYYNNNNN)`);
        setLoading(false);
        return;
      }
      if (!track.audioFile) {
        setError(`Track ${i + 1}: Audio file is required`);
        setLoading(false);
        return;
      }
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Create release with all fields
      const releaseData = {
        user_id: user.id,
        title,
        artists: isVariousArtists ? ['Various Artists'] : artists.filter(a => a),
        featured_artists: featuredArtists.filter(a => a),
        label,
        upc,
        release_date: releaseDate,
        original_release_date: originalReleaseDate || null,
        catalog_number: catalogNumber || null,
        genre,
        p_line: `℗ ${pLine}`,
        c_line: cLine || null,
        status: 'draft',
        artist_profiles: artistProfiles.hasProfile ? artistProfiles : null
      };

      const { data: release, error: releaseError } = await supabase
        .from('releases')
        .insert(releaseData)
        .select()
        .single();

      if (releaseError) throw releaseError;

      // Upload cover art
      const coverPath = `covers/${release.id}/${coverArt.name}`;
      const { error: uploadError } = await supabase.storage
        .from('release-assets')
        .upload(coverPath, coverArt);

      if (uploadError) throw uploadError;

      // Create tracks
      for (const track of tracks) {
        const trackData = {
          release_id: release.id,
          user_id: user.id,
          title: track.title,
          version: track.version || null,
          explicit_status: track.explicit,
          isrc: track.isrc.replace(/-/g, ''),
          language: track.language,
          genre: track.genre,
          subgenre: track.subgenre,
          duration: track.duration,
          writers: track.writers,
          performers: track.performers,
          production: track.production,
          is_hi_res: track.isHiRes || false,
          is_lossless: track.isLossless || false
        };

        const { data: trackRecord, error: trackError } = await supabase
          .from('tracks')
          .insert(trackData)
          .select()
          .single();

        if (trackError) throw trackError;

        // Upload audio file
        if (track.audioFile) {
          const audioPath = `audio/${release.id}/${trackRecord.id}/${track.audioFile.name}`;
          const { error: audioUploadError } = await supabase.storage
            .from('release-assets')
            .upload(audioPath, track.audioFile);

          if (audioUploadError) throw audioUploadError;
        }
      }

      router.push('/dashboard/releases');
    } catch (err) {
      console.error('Error creating release:', err);
      setError(err instanceof Error ? err.message : 'Failed to create release');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/releases"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm">{t.backToReleases}</span>
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
            <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent">
              {t.newRelease}
            </span>
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Cover Art Section */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cover Art *</h2>
            <p className="text-sm text-gray-600 mb-4">
              Recommended size: 3000x3000 (1000x1000 minimum)<br/>
              Accepted formats: .jpg, .jpeg, .png<br/>
              Cover must be square (same width and height)
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div
                  onDrop={handleCoverDrop}
                  onDragOver={handleCoverDragOver}
                  onDragLeave={handleCoverDragLeave}
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging ? 'border-gray-900 bg-gray-100' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCoverArtUpload(file);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Drag and drop or click to upload
                  </p>
                </div>
                {coverArtError && (
                  <p className="mt-2 text-sm text-red-600">{coverArtError}</p>
                )}
              </div>
              
              {previewUrl && (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Cover preview"
                    className="w-full rounded-lg shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverArt(null);
                      setPreviewUrl(null);
                      setCoverArtError('');
                    }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Release Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Release Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Release Artist(s) {!isVariousArtists && '*'}
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isVariousArtists}
                        onChange={(e) => setIsVariousArtists(e.target.checked)}
                        className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                      />
                      <span className="text-sm font-medium text-gray-700">Various Artists</span>
                    </label>
                    {!isVariousArtists && (
                      <button
                        type="button"
                        onClick={handleAddArtist}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {!isVariousArtists && artists.map((artist, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={artist}
                      onChange={(e) => {
                        const updated = [...artists];
                        updated[index] = e.target.value;
                        setArtists(updated);
                      }}
                      placeholder="Artist name"
                      required
                      className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                    />
                    {artists.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveArtist(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                {!isVariousArtists && artists.length >= 5 && (
                  <p className="text-sm text-yellow-600 mt-2">
                    <AlertCircle className="inline w-4 h-4 mr-1" />
                    5+ artists detected - automatically converted to Various Artists
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Artist Profiles
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!artistProfiles.hasProfile}
                      onChange={(e) => setArtistProfiles({ ...artistProfiles, hasProfile: !e.target.checked })}
                      className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-700">Artist doesn't have profiles yet</span>
                  </label>
                  
                  {artistProfiles.hasProfile && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Spotify Artist URI
                        </label>
                        <input
                          type="text"
                          value={artistProfiles.spotify || ''}
                          onChange={(e) => setArtistProfiles({ ...artistProfiles, spotify: e.target.value })}
                          placeholder="spotify:artist:..."
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Apple Music Artist ID
                        </label>
                        <input
                          type="text"
                          value={artistProfiles.appleMusic || ''}
                          onChange={(e) => setArtistProfiles({ ...artistProfiles, appleMusic: e.target.value })}
                          placeholder="Artist ID"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-2">
                  Record Label *
                </label>
                <input
                  type="text"
                  id="label"
                  value={label}
                  onChange={(e) => {
                    setLabel(e.target.value);
                    // Auto-update P Line if it only has the year
                    if (pLine === `${new Date().getFullYear()} `) {
                      setPLine(`${new Date().getFullYear()} ${e.target.value}`);
                    }
                  }}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="upc" className="block text-sm font-medium text-gray-700 mb-2">
                  UPC/EAN *
                </label>
                <input
                  type="text"
                  id="upc"
                  value={upc}
                  onChange={(e) => setUpc(e.target.value.replace(/\D/g, ''))}
                  placeholder="12 digits (UPC) or 13 digits (EAN)"
                  required
                  maxLength={13}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                />
                <p className="text-xs text-gray-500 mt-1">UPC: 12 digits, EAN: 13 digits</p>
              </div>

              <div>
                <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Release Date *
                </label>
                <input
                  type="date"
                  id="releaseDate"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Genre *
                </label>
                <select
                  id="genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                >
                  <option value="">Select Genre</option>
                  {Object.keys(genreSubgenreMap).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="pLine" className="block text-sm font-medium text-gray-700 mb-2">
                  P Line (℗) *
                </label>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-600">℗</span>
                  <input
                    type="text"
                    id="pLine"
                    value={pLine}
                    onChange={(e) => setPLine(e.target.value)}
                    required
                    placeholder="Year Label Name"
                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cLine" className="block text-sm font-medium text-gray-700 mb-2">
                  C Line (©)
                </label>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-600">©</span>
                  <input
                    type="text"
                    id="cLine"
                    value={cLine}
                    onChange={(e) => setCLine(e.target.value)}
                    placeholder="Year Copyright Owner"
                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tracks Section */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tracks</h2>
              <button
                type="button"
                onClick={handleAddTrack}
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Track
              </button>
            </div>

            {tracks.length === 0 ? (
              <p className="text-gray-600">No tracks added yet. Click "Add Track" to begin.</p>
            ) : (
              <div className="space-y-8">
                {tracks.map((track, trackIndex) => (
                  <div key={track.id} className="p-6 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold text-gray-300">
                          {String(trackIndex + 1).padStart(2, '0')}
                        </span>
                        {track.isHiRes && (
                          <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded">
                            Hi-Res
                          </span>
                        )}
                        {!track.isHiRes && track.isLossless && (
                          <span className="px-2 py-1 bg-gray-400 text-white text-xs font-semibold rounded">
                            Lossless
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setTracks(tracks.filter(t => t.id !== track.id))}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Track Title *
                        </label>
                        <input
                          type="text"
                          value={track.title}
                          onChange={(e) => {
                            const updated = [...tracks];
                            updated[trackIndex].title = e.target.value;
                            setTracks(updated);
                          }}
                          required
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ISRC *
                        </label>
                        <input
                          type="text"
                          value={track.isrc}
                          onChange={(e) => {
                            const updated = [...tracks];
                            updated[trackIndex].isrc = formatISRC(e.target.value);
                            setTracks(updated);
                          }}
                          placeholder="CC-XXX-YY-NNNNN"
                          required
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                        <p className="text-xs text-gray-500 mt-1">Format: CCXXXYYNNNNN (e.g., US-RRR-20-12345)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Explicit Status *
                        </label>
                        <select
                          value={track.explicit}
                          onChange={(e) => {
                            const updated = [...tracks];
                            updated[trackIndex].explicit = e.target.value as 'Clean' | 'Explicit' | 'Not Explicit';
                            setTracks(updated);
                          }}
                          required
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        >
                          <option value="Not Explicit">Not Explicit</option>
                          <option value="Explicit">Explicit</option>
                          <option value="Clean">Clean</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Language *
                        </label>
                        <select
                          value={track.language}
                          onChange={(e) => {
                            const updated = [...tracks];
                            updated[trackIndex].language = e.target.value;
                            setTracks(updated);
                          }}
                          required
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        >
                          <option value="">Select Language</option>
                          {musicLanguages.map((lang) => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Genre *
                        </label>
                        <select
                          value={track.genre}
                          onChange={(e) => {
                            const updated = [...tracks];
                            updated[trackIndex].genre = e.target.value;
                            updated[trackIndex].subgenre = '';
                            setTracks(updated);
                          }}
                          required
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        >
                          <option value="">Select Genre</option>
                          {Object.keys(genreSubgenreMap).map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sub-genre *
                        </label>
                        <select
                          value={track.subgenre}
                          onChange={(e) => {
                            const updated = [...tracks];
                            updated[trackIndex].subgenre = e.target.value;
                            setTracks(updated);
                          }}
                          required
                          disabled={!track.genre}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition disabled:opacity-50"
                        >
                          <option value="">Select Sub-genre</option>
                          {track.genre && genreSubgenreMap[track.genre]?.map((sg) => (
                            <option key={sg} value={sg}>{sg}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Audio File Upload */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Audio File *
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Accepted formats: .aiff, .flac, .wav @ 44.1kHz or greater / 16-bit or 24-bit stereo
                      </p>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".aiff,.flac,.wav"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleTrackAudioUpload(trackIndex, file);
                          }}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                      </div>
                      
                      {track.audioFile && (
                        <div className="mt-3">
                          <Waveform 
                            audioFile={track.audioFile} 
                            onDurationChange={(duration) => {
                              const updated = [...tracks];
                              updated[trackIndex].duration = duration;
                              setTracks(updated);
                            }}
                          />
                          <p className="text-sm text-gray-600 mt-2">
                            {track.audioFile.name} • Duration: {track.duration}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Credits */}
                    <div className="space-y-4">
                      {/* Writers */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">Writers *</label>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...tracks];
                              updated[trackIndex].writers.push({
                                id: Date.now().toString(),
                                name: '',
                                role: 'Songwriter'
                              });
                              setTracks(updated);
                            }}
                            className="text-sm text-gray-600 hover:text-gray-900"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {track.writers.map((writer, writerIndex) => (
                          <div key={writer.id} className="flex items-center space-x-2 mb-2">
                            <input
                              type="text"
                              value={writer.name}
                              onChange={(e) => {
                                const updated = [...tracks];
                                updated[trackIndex].writers[writerIndex].name = e.target.value;
                                setTracks(updated);
                              }}
                              placeholder="Writer name"
                              required
                              className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                            />
                            <select
                              value={writer.role}
                              onChange={(e) => {
                                const updated = [...tracks];
                                updated[trackIndex].writers[writerIndex].role = e.target.value as any;
                                setTracks(updated);
                              }}
                              className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                            >
                              <option value="Adapter">Adapter</option>
                              <option value="Arranger">Arranger</option>
                              <option value="Composer">Composer</option>
                              <option value="Librettist">Librettist</option>
                              <option value="Lyricist">Lyricist</option>
                              <option value="Songwriter">Songwriter</option>
                              <option value="Transcriber">Transcriber</option>
                              <option value="Vocal Adaptation">Vocal Adaptation</option>
                            </select>
                            {track.writers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...tracks];
                                  updated[trackIndex].writers = track.writers.filter(w => w.id !== writer.id);
                                  setTracks(updated);
                                }}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Performers */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">Performers *</label>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...tracks];
                              updated[trackIndex].performers.push({
                                id: Date.now().toString(),
                                name: '',
                                role: 'Lead Vocals'
                              });
                              setTracks(updated);
                            }}
                            className="text-sm text-gray-600 hover:text-gray-900"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {track.performers.map((performer, performerIndex) => (
                          <div key={performer.id} className="flex items-center space-x-2 mb-2">
                            <input
                              type="text"
                              value={performer.name}
                              onChange={(e) => {
                                const updated = [...tracks];
                                updated[trackIndex].performers[performerIndex].name = e.target.value;
                                setTracks(updated);
                              }}
                              placeholder="Performer name or artist name"
                              required
                              className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                            />
                            <select
                              value={performer.role}
                              onChange={(e) => {
                                const updated = [...tracks];
                                updated[trackIndex].performers[performerIndex].role = e.target.value;
                                setTracks(updated);
                              }}
                              className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                            >
                              {performerRoles.map((role) => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                            {track.performers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...tracks];
                                  updated[trackIndex].performers = track.performers.filter(p => p.id !== performer.id);
                                  setTracks(updated);
                                }}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Production & Engineering */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">Production & Engineering *</label>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...tracks];
                              updated[trackIndex].production.push({
                                id: Date.now().toString(),
                                name: '',
                                role: 'Producer'
                              });
                              setTracks(updated);
                            }}
                            className="text-sm text-gray-600 hover:text-gray-900"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {track.production.map((prod, prodIndex) => (
                          <div key={prod.id} className="flex items-center space-x-2 mb-2">
                            <input
                              type="text"
                              value={prod.name}
                              onChange={(e) => {
                                const updated = [...tracks];
                                updated[trackIndex].production[prodIndex].name = e.target.value;
                                setTracks(updated);
                              }}
                              placeholder="Producer/Engineer name"
                              required
                              className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                            />
                            <select
                              value={prod.role}
                              onChange={(e) => {
                                const updated = [...tracks];
                                updated[trackIndex].production[prodIndex].role = e.target.value;
                                setTracks(updated);
                              }}
                              className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                            >
                              {productionRoles.map((role) => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                            {track.production.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...tracks];
                                  updated[trackIndex].production = track.production.filter(p => p.id !== prod.id);
                                  setTracks(updated);
                                }}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pb-8">
            <button
              type="button"
              onClick={() => router.push('/dashboard/releases')}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full font-medium transition"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 disabled:opacity-50 transition"
            >
              {loading ? t.creating : t.createRelease}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}