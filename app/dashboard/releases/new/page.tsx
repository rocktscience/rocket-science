'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, Upload, X } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useTranslations } from '@/app/providers/TranslationProvider';
import CollaboratorDropdown from '@/components/CollaboratorDropdown';
import AudioFileDropzone from '@/components/AudioFileDropzone';
import Waveform from '@/components/Waveform';
import { musicGenres, genreSubgenreMap, musicLanguages } from '@/lib/constants/musicData';

interface Track {
  id: string;
  title: string;
  artist: string;
  isrc: string;
  needsISRC: boolean;
  explicit: boolean;
  language: string;
  genre: string;
  subGenre: string;
  audioFile: File | null;
  duration: string;
  audioQuality: 'lossless' | 'hi-res' | null;
  collaborators: {
    writers: string[];
    performers: string[];
    production: string[];
  };
}

export default function NewReleasePage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { t } = useTranslations();
  
  const [loading, setLoading] = useState(false);
  const [processingAudio, setProcessingAudio] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [expandedTracks, setExpandedTracks] = useState<string[]>([]);
  
  // Cover Art
  const [coverArt, setCoverArt] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [coverValidation, setCoverValidation] = useState<{valid: boolean; message: string} | null>(null);
  
  // Release Information
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [variousArtists, setVariousArtists] = useState(false);
  const [recordLabel, setRecordLabel] = useState('');
  const [upc, setUpc] = useState('');
  const [needsUPC, setNeedsUPC] = useState(false);
  const [releaseDate, setReleaseDate] = useState('');
  const [primaryGenre, setPrimaryGenre] = useState('');
  const [pLine, setPLine] = useState(`℗ ${new Date().getFullYear()} `);
  const [cLine, setCLine] = useState(`© ${new Date().getFullYear()} `);
  
  // Tracks
  const [tracks, setTracks] = useState<Track[]>([]);

  const validateCoverArt = (file: File): Promise<{valid: boolean; message: string}> => {
    return new Promise((resolve) => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        resolve({ valid: false, message: 'Please select an image file (JPG or PNG)' });
        return;
      }

      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        resolve({ valid: false, message: 'Only JPG or PNG formats are allowed' });
        return;
      }

      // Create image to check dimensions
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          // Check minimum dimensions
          if (img.width < 3000 || img.height < 3000) {
            resolve({ 
              valid: false, 
              message: `Image must be at least 3000×3000 pixels. Your image is ${img.width}×${img.height}` 
            });
            return;
          }

          // Check square format (1:1 ratio)
          if (img.width !== img.height) {
            resolve({ 
              valid: false, 
              message: `Image must be square (1:1 ratio). Your image is ${img.width}×${img.height}` 
            });
            return;
          }

          // Check for quality (basic check - could be enhanced)
          if (img.width > 10000 || img.height > 10000) {
            resolve({ 
              valid: true, 
              message: 'Cover art meets all requirements (Note: Very high resolution detected)' 
            });
          } else {
            resolve({ 
              valid: true, 
              message: 'Cover art meets all requirements' 
            });
          }
        };

        img.onerror = () => {
          resolve({ valid: false, message: 'Failed to load image. File may be corrupted.' });
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        resolve({ valid: false, message: 'Failed to read file' });
      };

      reader.readAsDataURL(file);
    });
  };

  const handleCoverArtChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate cover art
    const validation = await validateCoverArt(file);
    setCoverValidation(validation);
    
    if (!validation.valid) {
      setError(validation.message);
      return;
    }
    
    setCoverArt(file);
    setError('');
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const formatISRC = (value: string): string => {
    const clean = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    if (clean.length <= 2) return clean;
    if (clean.length <= 5) return `${clean.slice(0, 2)}-${clean.slice(2)}`;
    if (clean.length <= 7) return `${clean.slice(0, 2)}-${clean.slice(2, 5)}-${clean.slice(5)}`;
    if (clean.length <= 12) return `${clean.slice(0, 2)}-${clean.slice(2, 5)}-${clean.slice(5, 7)}-${clean.slice(7)}`;
    return `${clean.slice(0, 2)}-${clean.slice(2, 5)}-${clean.slice(5, 7)}-${clean.slice(7, 12)}`;
  };

  const validateISRC = (value: string): boolean => {
    const isrcRegex = /^[A-Z]{2}-[A-Z0-9]{3}-\d{2}-\d{5}$/;
    return isrcRegex.test(value);
  };

  const addTrack = () => {
    const newTrack: Track = {
      id: `track-${Date.now()}`,
      title: '',
      artist: variousArtists ? '' : artist,
      isrc: '',
      needsISRC: false,
      explicit: false,
      language: 'English',
      genre: primaryGenre,
      subGenre: '',
      audioFile: null,
      duration: '',
      audioQuality: null,
      collaborators: {
        writers: [],
        performers: [],
        production: []
      }
    };
    
    setTracks([...tracks, newTrack]);
    setExpandedTracks([...expandedTracks, newTrack.id]);
  };

  const removeTrack = (trackId: string) => {
    setTracks(tracks.filter(t => t.id !== trackId));
    setExpandedTracks(expandedTracks.filter(id => id !== trackId));
  };

  const updateTrack = (trackId: string, updates: Partial<Track>) => {
    setTracks(tracks.map(t => 
      t.id === trackId ? { ...t, ...updates } : t
    ));
  };

  const toggleTrackExpanded = (trackId: string) => {
    setExpandedTracks(prev =>
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const getSubgenresForGenre = (genre: string): string[] => {
    return genreSubgenreMap[genre] || [];
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Upload cover art if present (no size limit)
      let coverUrl = null;
      if (coverArt) {
        const fileExt = coverArt.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        // Create the storage bucket if it doesn't exist
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cover-art')
          .upload(fileName, coverArt);
        
        if (uploadError) throw uploadError;
        coverUrl = uploadData.path;
      }

      // Create release
      const releaseData = {
        user_id: user.id,
        title,
        artist: variousArtists ? 'Various Artists' : artist,
        metadata: {
          label: recordLabel,
          various_artists: variousArtists,
          needs_upc: needsUPC,
          cover_url: coverUrl,
          genre: primaryGenre
        },
        release_date: releaseDate,
        p_line: pLine,
        c_line: cLine,
        status: 'draft'
      };

      // Add UPC if not needed to be generated
      if (!needsUPC && upc) {
        releaseData.metadata.upc = upc;
      }

      const { data: release, error: releaseError } = await supabase
        .from('releases')
        .insert(releaseData)
        .select()
        .single();

      if (releaseError) throw releaseError;

      // Save tracks without audio files (for draft)
      const tracksData = tracks.map((track, index) => ({
        release_id: release.id,
        title: track.title,
        artist: variousArtists ? track.artist : artist,
        track_number: index + 1,
        duration: track.duration || 0,
        isrc: track.needsISRC ? null : track.isrc,
        explicit_content: track.explicit,
        audio_quality: track.audioQuality,
        contributors: track.collaborators,
        credits: {
          language: track.language,
          genre: track.genre,
          sub_genre: track.subGenre,
          needs_isrc: track.needsISRC
        }
      }));

      if (tracksData.length > 0) {
        const { error: tracksError } = await supabase
          .from('tracks')
          .insert(tracksData);
        
        if (tracksError) throw tracksError;
      }

      router.push('/dashboard/releases');
    } catch (err) {
      console.error('Error saving draft:', err);
      setError(err instanceof Error ? err.message : 'Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!coverArt) {
      setError('Cover art is required');
      setLoading(false);
      return;
    }

    // Validate cover art meets specs
    if (coverValidation && !coverValidation.valid) {
      setError(coverValidation.message);
      setLoading(false);
      return;
    }

    if (tracks.length === 0) {
      setError('At least one track is required');
      setLoading(false);
      return;
    }

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (!track.audioFile) {
        setError(`Track ${i + 1}: Audio file is required`);
        setLoading(false);
        return;
      }
      
      if (!track.needsISRC && track.isrc && !validateISRC(track.isrc)) {
        setError(`Track ${i + 1}: Invalid ISRC format`);
        setLoading(false);
        return;
      }
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Upload cover art (no size limit)
      const fileExt = coverArt.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cover-art')
        .upload(fileName, coverArt);
      
      if (uploadError) throw uploadError;
      const coverUrl = uploadData.path;

      // Create release
      const releaseData = {
        user_id: user.id,
        title,
        artist: variousArtists ? 'Various Artists' : artist,
        metadata: {
          label: recordLabel,
          various_artists: variousArtists,
          needs_upc: needsUPC,
          cover_url: coverUrl,
          genre: primaryGenre
        },
        release_date: releaseDate,
        p_line: pLine,
        c_line: cLine,
        status: 'submitted'
      };

      if (!needsUPC && upc) {
        releaseData.metadata.upc = upc;
      }

      const { data: release, error: releaseError } = await supabase
        .from('releases')
        .insert(releaseData)
        .select()
        .single();

      if (releaseError) throw releaseError;

      // Upload audio files and save tracks (no size limit)
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        if (!track.audioFile) continue;

        // Upload audio file
        const audioExt = track.audioFile.name.split('.').pop();
        const audioFileName = `${user.id}/${release.id}/track-${i + 1}.${audioExt}`;
        const { data: audioUpload, error: audioError } = await supabase.storage
          .from('audio-files')
          .upload(audioFileName, track.audioFile);
        
        if (audioError) throw audioError;

        const trackData = {
          release_id: release.id,
          title: track.title,
          artist: variousArtists ? track.artist : artist,
          track_number: i + 1,
          duration: parseInt(track.duration) || 0,
          isrc: track.needsISRC ? null : track.isrc,
          explicit_content: track.explicit,
          audio_file_url: audioUpload.path,
          audio_quality: track.audioQuality,
          contributors: track.collaborators,
          credits: {
            language: track.language,
            genre: track.genre,
            sub_genre: track.subGenre,
            needs_isrc: track.needsISRC
          }
        };

        const { error: trackError } = await supabase
          .from('tracks')
          .insert(trackData);
        
        if (trackError) throw trackError;
      }

      router.push('/dashboard/releases');
    } catch (err) {
      console.error('Error creating release:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit release');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Link
            href="/dashboard/releases"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm">{t.backToReleases || 'Back to Releases'}</span>
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
            <span className="bg-gradient-to-b from-gray-600 to-black bg-clip-text text-transparent">
              New Release
            </span>
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Cover Art */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cover Art</h2>
            
            <div className="flex items-start space-x-6">
              <div className="relative">
                {coverPreview ? (
                  <div className="relative">
                    <img
                      src={coverPreview}
                      alt="Cover art preview"
                      className="w-48 h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverArt(null);
                        setCoverPreview('');
                        setCoverValidation(null);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {coverValidation && (
                      <div className={`mt-2 text-xs ${coverValidation.valid ? 'text-green-600' : 'text-red-600'}`}>
                        {coverValidation.message}
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Upload Cover</span>
                    <span className="text-xs text-gray-500 mt-1">3000x3000px min</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleCoverArtChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-2">Cover Art Requirements</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Minimum 3000×3000 pixels</li>
                  <li>• Square format (1:1 ratio)</li>
                  <li>• JPG or PNG format</li>
                  <li>• No file size limit</li>
                  <li>• High quality, no pixelation</li>
                  <li>• No promotional text or logos</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Release Information */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Release Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Release Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className={variousArtists ? 'opacity-50' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Release Artist(s) {!variousArtists && '*'}
                </label>
                <CollaboratorDropdown
                  value={artist}
                  onChange={(value) => setArtist(value)}
                  type="artist"
                  placeholder="Type to search or add new artist..."
                  required={!variousArtists}
                  disabled={variousArtists}
                  className="w-full"
                />
              </div>

              <div>
                <label className="flex items-center space-x-3 mt-8">
                  <input
                    type="checkbox"
                    checked={variousArtists}
                    onChange={(e) => {
                      setVariousArtists(e.target.checked);
                      if (e.target.checked) setArtist('');
                    }}
                    className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  />
                  <span className="text-sm font-medium text-gray-700">Various Artists</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Record Label
                </label>
                <input
                  type="text"
                  value={recordLabel}
                  onChange={(e) => setRecordLabel(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPC {!needsUPC && '*'}
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={upc}
                    onChange={(e) => setUpc(e.target.value.replace(/\D/g, ''))}
                    placeholder="12-digit UPC"
                    maxLength={12}
                    required={!needsUPC}
                    disabled={needsUPC}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
                  />
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={needsUPC}
                      onChange={(e) => {
                        setNeedsUPC(e.target.checked);
                        if (e.target.checked) setUpc('');
                      }}
                      className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-600">Need UPC</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Release Date *
                </label>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Genre *
                </label>
                <select
                  value={primaryGenre}
                  onChange={(e) => setPrimaryGenre(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">Select Genre</option>
                  {musicGenres.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  P Line (℗) *
                </label>
                <input
                  type="text"
                  value={pLine}
                  onChange={(e) => setPLine(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  C Line (©) *
                </label>
                <input
                  type="text"
                  value={cLine}
                  onChange={(e) => setCLine(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Tracks */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tracks</h2>
              <button
                type="button"
                onClick={addTrack}
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Track
              </button>
            </div>

            {tracks.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">No tracks added yet</p>
                <button
                  type="button"
                  onClick={addTrack}
                  className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Track
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {tracks.map((track, index) => (
                  <div key={track.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div 
                      className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleTrackExpanded(track.id)}
                    >
                      <div className="flex items-center space-x-4">
                        {expandedTracks.includes(track.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold text-gray-400">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {track.title || `Track ${index + 1}`}
                            </h3>
                            {track.audioQuality && (
                              <div className="mt-1">
                                {track.audioQuality === 'hi-res' ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                                    Hi-Res
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-600 text-white">
                                    Lossless
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTrack(track.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {expandedTracks.includes(track.id) && (
                      <div className="p-6 border-t space-y-6">
                        {/* Track Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Track Title *
                            </label>
                            <input
                              type="text"
                              value={track.title}
                              onChange={(e) => updateTrack(track.id, { title: e.target.value })}
                              required
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                          </div>

                          {variousArtists && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Track Artist *
                              </label>
                              <CollaboratorDropdown
                                value={track.artist}
                                onChange={(value) => updateTrack(track.id, { artist: value })}
                                type="artist"
                                placeholder="Search or add artist..."
                                required
                                className="w-full"
                              />
                            </div>
                          )}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ISRC {!track.needsISRC && '*'}
                            </label>
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={track.isrc}
                                onChange={(e) => updateTrack(track.id, { isrc: formatISRC(e.target.value) })}
                                placeholder="XX-XXX-YY-NNNNN"
                                required={!track.needsISRC}
                                disabled={track.needsISRC}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
                              />
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={track.needsISRC}
                                  onChange={(e) => updateTrack(track.id, { 
                                    needsISRC: e.target.checked,
                                    isrc: e.target.checked ? '' : track.isrc
                                  })}
                                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                                />
                                <span className="text-sm text-gray-600">Need ISRC</span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Explicit Status *
                            </label>
                            <select
                              value={track.explicit ? 'explicit' : 'clean'}
                              onChange={(e) => updateTrack(track.id, { explicit: e.target.value === 'explicit' })}
                              required
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                            >
                              <option value="clean">Clean</option>
                              <option value="explicit">Explicit</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Language *
                            </label>
                            <select
                              value={track.language}
                              onChange={(e) => updateTrack(track.id, { language: e.target.value })}
                              required
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                            >
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
                              onChange={(e) => updateTrack(track.id, { genre: e.target.value, subGenre: '' })}
                              required
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                            >
                              <option value="">Select Genre</option>
                              {musicGenres.map((genre) => (
                                <option key={genre} value={genre}>{genre}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Sub-genre
                            </label>
                            <select
                              value={track.subGenre}
                              onChange={(e) => updateTrack(track.id, { subGenre: e.target.value })}
                              disabled={!track.genre}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
                            >
                              <option value="">Select Sub-genre</option>
                              {getSubgenresForGenre(track.genre).map((subgenre) => (
                                <option key={subgenre} value={subgenre}>{subgenre}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Audio File */}
                        <div>
                          {processingAudio === track.id ? (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                              <p className="text-sm text-gray-600">Processing audio file...</p>
                            </div>
                          ) : track.audioFile ? (
                            <Waveform
                              audioFile={track.audioFile}
                              onDurationChange={(duration) => updateTrack(track.id, { duration })}
                              onAnalysis={(isHiRes, isLossless) => {
                                updateTrack(track.id, {
                                  audioQuality: isHiRes ? 'hi-res' : isLossless ? 'lossless' : null
                                });
                              }}
                              onRemove={() => updateTrack(track.id, { audioFile: null, audioQuality: null, duration: '' })}
                            />
                          ) : (
                            <AudioFileDropzone
                              onFileSelect={(file) => {
                                setProcessingAudio(track.id);
                                updateTrack(track.id, { audioFile: file });
                                setTimeout(() => setProcessingAudio(null), 500);
                              }}
                              trackNumber={index + 1}
                              required
                            />
                          )}
                        </div>

                        {/* Collaborators */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Collaborators</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Writers
                              </label>
                              <CollaboratorDropdown
                                value={track.collaborators.writers.join(', ')}
                                onChange={(value) => {
                                  const writers = value ? value.split(',').map(w => w.trim()).filter(w => w) : [];
                                  updateTrack(track.id, {
                                    collaborators: { ...track.collaborators, writers }
                                  });
                                }}
                                type="writer"
                                placeholder="Add writers..."
                                className="w-full"
                                multiple
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Performers
                              </label>
                              <CollaboratorDropdown
                                value={track.collaborators.performers.join(', ')}
                                onChange={(value) => {
                                  const performers = value ? value.split(',').map(p => p.trim()).filter(p => p) : [];
                                  updateTrack(track.id, {
                                    collaborators: { ...track.collaborators, performers }
                                  });
                                }}
                                type="performer"
                                placeholder="Add performers..."
                                className="w-full"
                                multiple
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Production & Engineering
                              </label>
                              <CollaboratorDropdown
                                value={track.collaborators.production.join(', ')}
                                onChange={(value) => {
                                  const production = value ? value.split(',').map(p => p.trim()).filter(p => p) : [];
                                  updateTrack(track.id, {
                                    collaborators: { ...track.collaborators, production }
                                  });
                                }}
                                type="production"
                                placeholder="Add production team..."
                                className="w-full"
                                multiple
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={loading}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-full font-medium transition"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 disabled:opacity-50 transition"
            >
              {loading ? 'Processing...' : 'Send Release'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}