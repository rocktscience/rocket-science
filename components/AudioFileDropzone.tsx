'use client';

import { useState, useCallback } from 'react';
import { Upload, Music, X, FileAudio } from 'lucide-react';

interface AudioFileDropzoneProps {
  onFileSelect: (file: File) => void;
  trackNumber: number;
  required?: boolean;
}

export default function AudioFileDropzone({ 
  onFileSelect, 
  trackNumber,
  required = true 
}: AudioFileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const validateAudioFile = (file: File): boolean => {
    setError('');
    
    // Check file extension first
    const extension = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['aiff', 'aif', 'flac', 'wav'];
    
    if (!validExtensions.includes(extension || '')) {
      setError('Only .aiff, .flac, and .wav files are accepted');
      return false;
    }
    
    // No file size limit as requested
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateAudioFile(file)) {
      onFileSelect(file);
      setError('');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Audio File {required && '*'}
      </label>
      <p className="text-xs text-gray-500 mb-2">
        Accepted formats: .aiff, .flac, .wav @ 44.1kHz+, 16 or 24-bit stereo for lossless, 88.2kHz+, 24-bit stereo for Hi-Res
      </p>
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
          isDragging 
            ? 'border-gray-900 bg-gray-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input
          type="file"
          accept=".aiff,.aif,.flac,.wav"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          required={required}
        />
        
        <div className="flex flex-col items-center">
          <div className="p-3 bg-gray-100 rounded-full mb-3">
            <FileAudio className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            Drop audio file here or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Track {String(trackNumber).padStart(2, '0')} audio file
          </p>
        </div>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}