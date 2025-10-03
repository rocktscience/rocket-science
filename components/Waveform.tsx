'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, X } from 'lucide-react';

interface WaveformProps {
  audioFile: File;
  onDurationChange?: (duration: string) => void;
  onAnalysis?: (isHiRes: boolean, isLossless: boolean) => void;
  onRemove?: () => void;
}

export default function Waveform({ audioFile, onDurationChange, onAnalysis, onRemove }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [waveformData, setWaveformData] = useState<Float32Array | null>(null);
  const [audioInfo, setAudioInfo] = useState<{
    sampleRate: number;
    bitDepth: string;
    channels: number;
    isHiRes: boolean;
    isLossless: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!audioFile) return;

    const initializeAudio = async () => {
      setError(null);
      setLoading(true);

      try {
        // Create audio context
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        audioContextRef.current = new AudioContext();
        
        // Create object URL for audio playback
        const url = URL.createObjectURL(audioFile);
        setAudioUrl(url);
        
        // Read file as array buffer
        const arrayBuffer = await audioFile.arrayBuffer();
        
        // Decode audio data
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        
        // Get audio properties
        const sampleRate = audioBuffer.sampleRate;
        const numberOfChannels = audioBuffer.numberOfChannels;
        const duration = audioBuffer.duration;
        
        // Determine audio quality
        const isHiRes = sampleRate >= 88200 && numberOfChannels === 2;
        const isLossless = (sampleRate >= 44100 && numberOfChannels === 2) || isHiRes;
        
        // Estimate bit depth
        let bitDepth = '16-bit';
        if (isHiRes || (audioFile.size / (sampleRate * numberOfChannels * duration) > 2.5)) {
          bitDepth = '24-bit';
        }
        
        setAudioInfo({
          sampleRate,
          bitDepth,
          channels: numberOfChannels,
          isHiRes,
          isLossless
        });
        
        if (onAnalysis) {
          onAnalysis(isHiRes, isLossless);
        }
        
        // Format and set duration
        const totalSeconds = Math.floor(duration);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const formattedDuration = `${totalSeconds}`; // Store as seconds string
        
        setDuration(duration);
        
        if (onDurationChange) {
          onDurationChange(formattedDuration);
        }
        
        // Get waveform data
        const channelData = audioBuffer.getChannelData(0);
        setWaveformData(channelData);
        
        // Draw initial waveform
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            drawWaveform(channelData, canvas, ctx);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error processing audio:', err);
        setError('Error processing audio file. Please ensure it\'s a valid audio file.');
        setLoading(false);
      }
    };

    initializeAudio();
    
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioFile]);

  const drawWaveform = (
    channelData: Float32Array, 
    canvas: HTMLCanvasElement, 
    ctx: CanvasRenderingContext2D,
    progress: number = 0
  ) => {
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate samples per pixel
    const samplesPerPixel = Math.floor(channelData.length / width);
    const amplitude = height / 2;
    
    // Draw waveform
    for (let x = 0; x < width; x++) {
      let min = 1.0;
      let max = -1.0;
      
// Find min/max in this pixel's sample range
      for (let i = 0; i < samplesPerPixel; i++) {
        const sampleIndex = x * samplesPerPixel + i;
        if (sampleIndex < channelData.length) {
          const sample = channelData[sampleIndex];
          if (sample < min) min = sample;
          if (sample > max) max = sample;
        }
      }
      
      // Draw vertical line for this pixel
      const barHeight = Math.max(1, (max - min) * amplitude);
      const barY = (1 + min) * amplitude;
      
      // Color based on progress
      if (x / width <= progress) {
        ctx.fillStyle = '#111827';
      } else {
        ctx.fillStyle = '#d1d5db';
      }
      
      ctx.fillRect(x, barY, 1, barHeight);
    }
    
    // Draw progress line
    if (progress > 0) {
      const progressX = width * progress;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, height);
      ctx.stroke();
    }
  };

  const updateProgress = () => {
    if (audioRef.current && canvasRef.current && waveformData) {
      const progress = audioRef.current.currentTime / audioRef.current.duration;
      setCurrentTime(audioRef.current.currentTime);
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawWaveform(waveformData, canvas, ctx, progress);
      }
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(updateProgress);
      }
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      updateProgress();
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !audioRef.current || !waveformData) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    
    audioRef.current.currentTime = progress * duration;
    setCurrentTime(audioRef.current.currentTime);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawWaveform(waveformData, canvas, ctx, progress);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Audio File
        </label>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="relative w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="h-24 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              <span className="text-sm">Processing audio...</span>
            </div>
          </div>
        ) : (
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={96}
              onClick={handleCanvasClick}
              className="w-full h-24 cursor-pointer block"
            />
            
            <button
              type="button"
              onClick={togglePlayback}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-gray-900" />
              ) : (
                <Play className="w-4 h-4 text-gray-900 ml-0.5" />
              )}
            </button>
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow-sm border border-gray-200">
              <span className="text-xs font-medium text-gray-700">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {audioInfo && (
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span>{(audioInfo.sampleRate / 1000).toFixed(1)} kHz</span>
            <span>{audioInfo.bitDepth}</span>
            <span>{audioInfo.channels === 2 ? 'Stereo' : 'Mono'}</span>
          </div>
          <div className="flex items-center gap-2">
            {audioInfo.isHiRes && (
              <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded text-xs font-semibold">
                Hi-Res
              </span>
            )}
            {!audioInfo.isHiRes && audioInfo.isLossless && (
              <span className="px-2 py-1 bg-gray-600 text-white rounded text-xs font-semibold">
                Lossless
              </span>
            )}
          </div>
        </div>
      )}
      
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={() => {
            if (audioRef.current && !isPlaying) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
            if (canvasRef.current && waveformData) {
              const canvas = canvasRef.current;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                drawWaveform(waveformData, canvas, ctx, 0);
              }
            }
          }}
          className="hidden"
        />
      )}
    </div>
  );
}