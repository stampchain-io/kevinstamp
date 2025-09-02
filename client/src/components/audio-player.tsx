import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  className?: string;
}

export default function AudioPlayer({ className = '' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3); // Start at 30% volume
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume
    audio.volume = volume;
    audio.loop = true; // Loop the track

    // Auto-play attempt (some browsers block this)
    const tryAutoPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        // Silently handle autoplay prevention - this is expected behavior
        setIsPlaying(false);
      }
    };

    // Small delay to ensure component is mounted
    const timer = setTimeout(tryAutoPlay, 1000);

    return () => clearTimeout(timer);
  }, [volume]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newMuted = !isMuted;
    audio.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume;
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className="bg-black bg-opacity-90 border-2 border-kevin-orange p-3 rounded-lg pixel-art-border">
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="pixel-btn bg-kevin-orange text-black hover:bg-kevin-neon transition-colors p-2"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-kevin-orange hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-kevin-graphite rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #F7931A 0%, #F7931A ${volume * 100}%, #2A2A2A ${volume * 100}%, #2A2A2A 100%)`
              }}
            />
          </div>

          {/* Track Info */}
          <div className="text-xs text-kevin-orange font-pixel hidden sm:block">🎵 </div>
        </div>
      </div>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={(e) => {
          // Only log actual errors, not network issues during development
          if (process.env.NODE_ENV === 'development') {
            console.warn('Audio loading error:', e);
          }
          setIsPlaying(false);
        }}
      >
        <source src="/Music/clubbed-to-death-matrix.mp3" type="audio/mpeg" />
        <source src="/Music/clubbed-to-death-matrix.wav" type="audio/wav" />
        Your browser does not support audio playback.
      </audio>
    </div>
  );
}