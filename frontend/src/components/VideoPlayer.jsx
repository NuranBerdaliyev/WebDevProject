import { useEffect, useRef, useState, useCallback } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

// Запасные видео на случай если основное не загрузится
const FALLBACK_VIDEOS = [
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://www.w3schools.com/html/mov_bbb.mp4'
];

const VideoPlayer = ({ movie, onClose }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showBigPlay, setShowBigPlay] = useState(true);

  const getVideoUrl = useCallback(() => {
    if (movie?.video_url) return movie.video_url;
    return FALLBACK_VIDEOS[currentVideoIndex];
  }, [movie, currentVideoIndex]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === ' ') { e.preventDefault(); togglePlay(); }
      else if (e.key === 'ArrowRight') skip(10);
      else if (e.key === 'ArrowLeft') skip(-10);
      else if (e.key === 'm') toggleMute();
      else if (e.key === 'f') toggleFullscreen();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowBigPlay(true);
    } else {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setShowBigPlay(false);
        })
        .catch((err) => {
          console.error('Play failed:', err);
          // Пробуем следующее видео
          tryNextVideo();
        });
    }
  };

  const tryNextVideo = () => {
    if (currentVideoIndex < FALLBACK_VIDEOS.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
      setError(null);
      setIsLoaded(false);
    } else {
      setError('Не удалось загрузить видео. Проверьте подключение к интернету.');
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 0;
      setCurrentTime(current);
      setDuration(total);
      setProgress(total > 0 ? (current / total) * 100 : 0);
    }
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current?.duration) {
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const skip = (seconds) => {
    if (videoRef.current) {
      const newTime = videoRef.current.currentTime + seconds;
      videoRef.current.currentTime = Math.max(0, Math.min(newTime, videoRef.current.duration || 0));
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleLoadedMetadata = () => {
    console.log('Video loaded:', getVideoUrl());
    setIsLoaded(true);
    setDuration(videoRef.current?.duration || 0);
    setError(null);

    // Пробуем автовоспроизведение
    videoRef.current?.play()
      .then(() => {
        setIsPlaying(true);
        setShowBigPlay(false);
      })
      .catch(() => {
        // Автовоспроизведение заблокировано
        setIsPlaying(false);
        setShowBigPlay(true);
      });
  };

  const handleError = (e) => {
    console.error('Video error for URL:', getVideoUrl(), e);
    tryNextVideo();
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* Кнопка закрытия */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-12 h-12 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition"
      >
        <X size={24} />
      </button>

      {/* Заголовок */}
      <div className="absolute top-4 left-4 z-20 text-white">
        <h2 className="text-xl font-bold drop-shadow-lg">{movie?.title || 'Видео'}</h2>
      </div>

      {/* Видео контейнер */}
      <div className="relative w-full h-full max-w-[1920px] mx-auto flex items-center justify-center">
        {/* Состояние загрузки */}
        {!isLoaded && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="w-16 h-16 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-white text-lg">Загрузка видео...</div>
            <div className="text-gray-400 text-sm mt-2">Попытка {currentVideoIndex + 1} из {FALLBACK_VIDEOS.length}</div>
          </div>
        )}

        {/* Ошибка */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/90">
            <div className="text-center px-4">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <div className="text-white text-xl mb-4">{error}</div>
              <button
                onClick={() => { setCurrentVideoIndex(0); setError(null); }}
                className="bg-netflix-red px-6 py-3 rounded hover:bg-red-700 transition mr-2"
              >
                Попробовать снова
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 px-6 py-3 rounded hover:bg-gray-700 transition"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}

        {/* Видео */}
        <video
          ref={videoRef}
          src={getVideoUrl()}
          className="w-full h-full max-h-screen object-contain bg-black"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleError}
          onEnded={() => { setIsPlaying(false); setShowBigPlay(true); }}
          onPause={() => { setIsPlaying(false); setShowBigPlay(true); }}
          onPlay={() => { setIsPlaying(true); setShowBigPlay(false); }}
          playsInline
          crossOrigin="anonymous"
          preload="auto"
        />

        {/* Большая кнопка Play */}
        {showBigPlay && isLoaded && (
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/40 transition"
            onClick={togglePlay}
          >
            <div className="w-24 h-24 bg-netflix-red rounded-full flex items-center justify-center hover:scale-110 transition shadow-2xl">
              <Play size={48} fill="white" className="ml-2" />
            </div>
          </div>
        )}
      </div>

      {/* Контролы */}
      {isLoaded && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pb-8">
          {/* Прогресс бар */}
          <div
            className="w-full h-1.5 bg-gray-600 rounded-full cursor-pointer mb-4 group"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-netflix-red rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition shadow" />
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="p-2 hover:bg-white/20 rounded-full transition"
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} fill="white" />}
              </button>

              {/* Назад/Вперёд */}
              <button onClick={() => skip(-10)} className="p-2 hover:bg-white/20 rounded-full transition text-sm font-bold">-10</button>
              <button onClick={() => skip(10)} className="p-2 hover:bg-white/20 rounded-full transition text-sm font-bold">+10</button>

              {/* Громкость */}
              <div className="flex items-center gap-2 ml-2">
                <button onClick={toggleMute} className="p-2 hover:bg-white/20 rounded-full transition">
                  {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Время */}
              <span className="text-sm text-gray-300 ml-2 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Полноэкранный */}
            <button onClick={toggleFullscreen} className="p-2 hover:bg-white/20 rounded-full transition">
              <Maximize size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;