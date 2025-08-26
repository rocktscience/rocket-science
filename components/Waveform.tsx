'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface WaveformProps {
  audioFile: File;
  onDurationChange?: (duration: string) => void;
  onAnalysis?: (isHiRes: boolean, isLossless: boolean) => void;
}

export default function Waveform({ audioFile, onDurationChange, onAnalysis }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string>('');

  useEffect(() => {
    if (!audioFile || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create object URL for audio playback
    const url = URL.createObjectURL(audioFile);
    setAudioUrl(url);
    
    // Read the file
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Get audio properties
        const sampleRate = audioBuffer.sampleRate;
        const numberOfChannels = audioBuffer.numberOfChannels;
        const duration = audioBuffer.duration;
        
        // Determine if Hi-Res or Lossless
        // Hi-Res: 24-bit with sample rates of 88.2, 96, 176.4, or 192 kHz
        // Note: Bit depth detection requires more complex analysis
        const hiResSampleRates = [88200, 96000, 176400, 192000];
        const isHiRes = hiResSampleRates.includes(sampleRate);
        const isLossless = sampleRate >= 44100; // Simplified check
        
        if (onAnalysis) {
          onAnalysis(isHiRes, isLossless);
        }
        
        // Format duration
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        setDuration(duration);
        
        if (onDurationChange) {
          onDurationChange(formattedDuration);
        }
        
        // Draw waveform
        drawWaveform(audioBuffer, canvas, ctx);
        setLoading(false);
      } catch (error) {
        console.error('Error processing audio:', error);
        setLoading(false);
      }
    };
    
    reader.readAsArrayBuffer(audioFile);
    
    return () => {
      audioContext.close();
      if (url) URL.revokeObjectURL(url);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [audioFile, onDurationChange, onAnalysis]);

  const drawWaveform = (audioBuffer: AudioBuffer, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const width = canvas.width;
    const height = canvas.height;
    const channelData = audioBuffer.getChannelData(0);
    const step = Math.ceil(channelData.length / width);
    const amp = height / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);
    
    // Draw waveform
    ctx.beginPath();
    ctx.moveTo(0, amp);
    
    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      
      for (let j = 0; j < step; j++) {
        const datum = channelData[(i * step) + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      
      // Draw vertical lines for waveform
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(i, (1 + min) * amp);
      ctx.lineTo(i, (1 + max) * amp);
      ctx.stroke();
    }
  };

  const drawProgress = () => {
    if (!canvasRef.current || !audioRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const progress = audioRef.current.currentTime / audioRef.current.duration;
    const progressWidth = canvas.width * progress;
    
    // Draw progress overlay
    ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
    ctx.fillRect(0, 0, progressWidth, canvas.height);
    
    // Draw progress line
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(progressWidth, 0);
    ctx.lineTo(progressWidth, canvas.height);
    ctx.stroke();
  };

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      drawProgress();
      
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
    if (!canvasRef.current || !audioRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    
    audioRef.current.currentTime = progress * duration;
    setCurrentTime(audioRef.current.currentTime);
    drawProgress();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2">
      <div className="relative w-full h-20 bg-gray-100 rounded-lg overflow-hidden group">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-sm text-gray-500">Processing audio...</div>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          width={800}
          height={80}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-pointer"
          style={{ display: loading ? 'none' : 'block' }}
        />
        
        {!loading && (
          <button
            type="button"
            onClick={togglePlayback}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-gray-900" />
            ) : (
              <Play className="w-4 h-4 text-gray-900" />
            )}
          </button>
        )}
      </div>
      
      {!loading && (
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
      
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
}