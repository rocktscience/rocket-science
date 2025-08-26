'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface WaveformVisualizerProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function WaveformVisualizer({ 
  audioUrl, 
  isPlaying, 
  onPlayPause 
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const [duration, setDuration] = useState('0:00');
  const [currentTime, setCurrentTime] = useState('0:00');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = document.querySelector(`audio[src="${audioUrl}"]`) as HTMLAudioElement;
    if (!audio) return;

    const updateTime = () => {
      const current = formatTime(audio.currentTime);
      const total = formatTime(audio.duration || 0);
      setCurrentTime(current);
      setDuration(total);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateTime);

    // Initialize Web Audio API
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;
      
      try {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
        sourceRef.current.connect(analyzerRef.current);
        analyzerRef.current.connect(audioContextRef.current.destination);
      } catch (e) {
        // Audio element might already be connected
        console.log('Audio context already connected');
      }
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateTime);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (isPlaying && analyzerRef.current && canvasRef.current) {
      drawWaveform();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      // Draw static waveform when paused
      drawStaticWaveform();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !analyzerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyzerRef.current!.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgb(243, 244, 246)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, 'rgb(147, 51, 234)');
        gradient.addColorStop(1, 'rgb(236, 72, 153)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      // Draw progress line
      const progressX = (canvas.width * progress) / 100;
      ctx.strokeStyle = 'rgb(17, 24, 39)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, canvas.height);
      ctx.stroke();
    };

    draw();
  };

  const drawStaticWaveform = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'rgb(243, 244, 246)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw fake waveform bars
    const barCount = 50;
    const barWidth = canvas.width / barCount - 1;
    
    for (let i = 0; i < barCount; i++) {
      const barHeight = Math.random() * canvas.height * 0.6 + canvas.height * 0.1;
      const x = i * (barWidth + 1);
      
      ctx.fillStyle = 'rgb(209, 213, 219)';
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    }

    // Draw progress line
    const progressX = (canvas.width * progress) / 100;
    ctx.strokeStyle = 'rgb(17, 24, 39)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(progressX, 0);
    ctx.lineTo(progressX, canvas.height);
    ctx.stroke();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onPlayPause}
          className="p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>
        
        <canvas
          ref={canvasRef}
          width={600}
          height={80}
          className="flex-1 rounded"
        />
        
        <div className="text-sm text-gray-600 whitespace-nowrap">
          {currentTime} / {duration}
        </div>
      </div>
    </div>
  );
}