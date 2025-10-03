'use client';

import { useState, useEffect } from 'react';
import { Trash2, ChevronDown, ChevronUp, Music } from 'lucide-react';
import CollaboratorDropdown from '@/components/CollaboratorDropdown';
import AudioFileDropzone from '@/components/AudioFileDropzone';
import Waveform from '@/components/Waveform';
import { 
  musicGenres, 
  musicSubgenres,
  musicLanguages,
  explicitContentOptions 
} from '@/lib/constants/musicData';

interface TrackFormProps {
  track: any;
  trackIndex: number;
  onUpdate: (index: number, data: any) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export default function TrackForm({ 
  track, 
  trackIndex, 
  onUpdate, 
  onRemove, 
  canRemove 
}: TrackFormProps) {
  const [isExpanded, setIsExpanded] = useState(trackIndex === 0);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [duration, setDuration] = useState('');
  const [audioQuality, setAudioQuality] = useState<'lossless' | 'hi-res' | null>(null);
  const [availableSubgenres, setAvailableSubgenres] = useState<string[]>([]);

  useEffect(() => {
    if (track.genre && musicSubgenres[track.genre]) {
      setAvailableSubgenres(musicSubgenres[track.genre]);
    } else {
      setAvailableSubgenres([]);
    }
  }, [track.genre]);

  const handleAudioFileSelect = (file: File | null) => {
    setAudioFile(file);
    if (file) {
      onUpdate(trackIndex, { ...track, audio_file: file });
    }
  };

  const handleAudioAnalysis = (isHiRes: boolean, isLossless: boolean) => {
    if (isHiRes) {
      setAudioQuality('hi-res');
      onUpdate(trackIndex, { ...track, audio_quality: 'hi-res' });
    } else if (isLossless) {
      setAudioQuality('lossless');
      onUpdate(trackIndex, { ...track, audio_quality: 'lossless' });
    }
  };

  const handleDurationChange = (newDuration: string) => {
    setDuration(newDuration);
    onUpdate(trackIndex, { ...track, duration: newDuration });
  };

  const updateField = (field: string, value: any) => {
    onUpdate(trackIndex, { ...track, [field]: value });
  };

  const addCollaborator = (type: string) => {
    const currentList = track.collaborators?.[type] || [];
    updateField('collaborators', {
      ...track.collaborators,
      [type]: [...currentList, '']
    });
  };

  const updateCollaborator = (type: string, index: number, value: string) => {
    const currentList = track.collaborators?.[type] || [];
    const updated = [...currentList];
    updated[index] = value;
    updateField('collaborators', {
      ...track.collaborators,
      [type]: updated
    });
  };

  const removeCollaborator = (type: string, index: number) => {
    const currentList = track.collaborators?.[type] || [];
    updateField('collaborators', {
      ...track.collaborators,
      [type]: currentList.filter((_: any, i: number) => i !== index)
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div 
        className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-500">
              Track {String(trackIndex + 1).padStart(2, '0')}
            </span>
            <span className="font-medium text-gray-900">
              {track.title || 'Untitled Track'}
            </span>
            {audioQuality && (
              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                audioQuality === 'hi-res' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-600 text-white'
              }`}>
                {audioQuality === 'hi-res' ? 'Hi-Res' : 'Lossless'}
              </span>
            )}
          </div>
        </div>
        
        {canRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(trackIndex);
            }}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Basic Track Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Track Title *
              </label>
              <input
                type="text"
                value={track.title}
                onChange={(e) => updateField('title', e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ISRC
              </label>
              <input
                type="text"
                value={track.isrc || ''}
                onChange={(e) => updateField('isrc', e.target.value)}
                placeholder="e.g., USRC17607839"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={track.needISRC || false}
                  onChange={(e) => updateField('needISRC', e.target.checked)}
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
                <span className="text-sm font-medium text-gray-700">Need ISRC</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Explicit Status *
              </label>
              <select
                value={track.explicit || ''}
                onChange={(e) => updateField('explicit', e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="">Select Status</option>
                {explicitContentOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language *
              </label>
              <select
                value={track.language || ''}
                onChange={(e) => updateField('language', e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="">Select Language</option>
                {musicLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre *
              </label>
              <select
                value={track.genre || ''}
                onChange={(e) => {
                  updateField('genre', e.target.value);
                  updateField('subgenre', ''); // Reset subgenre when genre changes
                }}
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="">Select Genre</option>
                {Object.keys(musicGenres).map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-genre
              </label>
              <select
                value={track.subgenre || ''}
                onChange={(e) => updateField('subgenre', e.target.value)}
                disabled={!track.genre || availableSubgenres.length === 0}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
              >
                <option value="">Select Sub-genre</option>
                {availableSubgenres.map(subgenre => (
                  <option key={subgenre} value={subgenre}>{subgenre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Audio File */}
          <div>
            <AudioFileDropzone
              onFileSelect={handleAudioFileSelect}
              audioFile={audioFile}
              trackNumber={trackIndex + 1}
              required
            />
            
            {audioFile && (
              <div className="mt-4">
                <Waveform
                  audioFile={audioFile}
                  onDurationChange={handleDurationChange}
                  onAnalysis={handleAudioAnalysis}
                />
              </div>
            )}
          </div>

          {/* Collaborators Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Collaborators</h3>
            
            {/* Writers */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Writers</label>
                <button
                  type="button"
                  onClick={() => addCollaborator('writers')}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  + Add Writer
                </button>
              </div>
              {(track.collaborators?.writers || []).map((writer: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <CollaboratorDropdown
                    value={writer}
                    onChange={(value) => updateCollaborator('writers', index, value)}
                    type="writer"
                    placeholder="Search or add writer..."
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeCollaborator('writers', index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Performers */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Performers</label>
                <button
                  type="button"
                  onClick={() => addCollaborator('performers')}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  + Add Performer
                </button>
              </div>
              {(track.collaborators?.performers || []).map((performer: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <CollaboratorDropdown
                    value={performer}
                    onChange={(value) => updateCollaborator('performers', index, value)}
                    type="performer"
                    placeholder="Search or add performer..."
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeCollaborator('performers', index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Production & Engineering */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Production & Engineering</label>
                <button
                  type="button"
                  onClick={() => addCollaborator('production')}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  + Add Production
                </button>
              </div>
              {(track.collaborators?.production || []).map((prod: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <CollaboratorDropdown
                    value={prod}
                    onChange={(value) => updateCollaborator('production', index, value)}
                    type="production"
                    placeholder="Search or add production/engineering..."
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeCollaborator('production', index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}