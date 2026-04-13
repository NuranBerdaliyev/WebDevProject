import { useState, useEffect } from 'react';
import { Play, Info } from 'lucide-react';
import { fetchMovies } from '../services/api';

const Hero = ({ onPlayMovie }) => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const loadHeroMovie = async () => {
      const movies = await fetchMovies('trending');
      // Выбираем случайный фильм для hero секции
      setMovie(movies[Math.floor(Math.random() * movies.length)]);
    };
    loadHeroMovie();
  }, []);

  if (!movie) return null;

  return (
    <div className="relative h-[80vh] min-h-[600px] w-full">
      {/* Фоновое изображение */}
      <div className="absolute inset-0">
        <img
          src={movie.backdrop_url}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* Градиенты для затемнения */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
      </div>

      {/* Контент */}
      <div className="relative h-full flex flex-col justify-center px-4 sm:px-8 lg:px-12 pt-20">
        <div className="max-w-2xl">
          {/* Заголовок фильма */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
            {movie.title}
          </h1>

          {/* Информация о фильме */}
          <div className="flex items-center gap-3 mb-4 text-sm">
            <span className="text-green-500 font-semibold">98% совпадение</span>
            <span className="text-gray-300">{movie.year || '2024'}</span>
            <span className="border border-gray-500 px-1">{movie.rating || '16+'}</span>
            <span className="text-gray-300">{movie.duration || '2ч'}</span>
          </div>

          {/* Описание */}
          <p className="text-lg sm:text-xl text-gray-200 mb-6 line-clamp-3 drop-shadow-md">
            {movie.overview}
          </p>

          {/* Кнопки действий */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onPlayMovie?.(movie)}
              className="flex items-center gap-2 bg-white text-black px-6 sm:px-8 py-2 sm:py-3 rounded font-semibold hover:bg-gray-200 transition text-sm sm:text-base"
            >
              <Play size={20} fill="black" />
              Смотреть
            </button>
            <button className="flex items-center gap-2 bg-gray-500/70 text-white px-6 sm:px-8 py-2 sm:py-3 rounded font-semibold hover:bg-gray-500/50 transition text-sm sm:text-base">
              <Info size={20} />
              Подробнее
            </button>
          </div>
        </div>
      </div>

      {/* Возрастное ограничение (справа снизу) */}
      <div className="absolute bottom-32 right-4 sm:right-8 bg-gray-500/30 border-l-4 border-white px-2 py-1 text-sm">
        16+
      </div>
    </div>
  );
};

export default Hero;
