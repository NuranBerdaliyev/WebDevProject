import { useState } from 'react';
import { X, Play, Plus, ThumbsUp, Share2, Check } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

const MovieModal = ({ movie, onClose, isFavorite, onToggleFavorite, onPlay }) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Затемнённый фон */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Модальное окно */}
      <div className="relative bg-netflix-dark rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition"
        >
          <X size={24} />
        </button>

        {/* Изображение */}
        <div className="relative h-[400px]">
          <img
            src={movie.backdrop_url}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-transparent to-transparent" />

          {/* Кнопки поверх изображения */}
          <div className="absolute bottom-6 left-6 flex items-center gap-3">
            <button
              onClick={() => {
                onPlay?.();
                onClose();
              }}
              className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition"
            >
              <Play size={20} fill="black" />
              Смотреть
            </button>
            <button
              onClick={onToggleFavorite}
              className={`w-10 h-10 border-2 rounded-full flex items-center justify-center transition ${
                isFavorite ? 'bg-white border-white text-black' : 'border-gray-400 hover:border-white'
              }`}
            >
              {isFavorite ? <Check size={20} /> : <Plus size={20} />}
            </button>
            <button className="w-10 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition">
              <ThumbsUp size={20} />
            </button>
            <button className="w-10 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Информация о фильме */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="text-green-500 font-semibold">98% совпадение</span>
                <span>{movie.year || '2024'}</span>
                <span className="border border-gray-500 px-1">{movie.rating || '16+'}</span>
                <span>{movie.duration || '2ч'}</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>
            <div className="text-sm text-gray-400 space-y-2">
              <div>
                <span className="text-gray-600">Жанры: </span>
                {movie.genre || 'Боевик, Триллер'}
              </div>
              <div>
                <span className="text-gray-600">Это: </span>
                Захватывающий, Напряжённый
              </div>
              <div>
                <span className="text-gray-600">Год выпуска: </span>
                {movie.year || '2024'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
