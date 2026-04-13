import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MovieRow = ({ title, movies, onMovieClick }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { current } = rowRef;
      const scrollAmount = direction === 'left' ? -current.clientWidth * 0.75 : current.clientWidth * 0.75;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="group relative px-4 sm:px-8 lg:px-12 py-4">
      {/* Заголовок */}
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-netflix-light">
        {title}
      </h2>

      {/* Контейнер с карточками */}
      <div className="relative">
        {/* Кнопка влево */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-black/50 opacity-0 group-hover:opacity-100 hover:bg-black/70 transition flex items-center justify-center -ml-4 sm:-ml-8"
        >
          <ChevronLeft size={40} />
        </button>

        {/* Скроллируемый ряд */}
        <div
          ref={rowRef}
          className="flex gap-2 overflow-x-auto hide-scrollbar scroll-smooth"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onMovieClick?.(movie)}
              className="movie-card flex-none w-32 sm:w-40 lg:w-48 cursor-pointer"
            >
              <div className="relative aspect-[2/3] rounded overflow-hidden bg-netflix-dark">
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/300x450/333/E50914?text=${encodeURIComponent(movie.title)}`;
                  }}
                />
                {/* Hover overlay с информацией */}
                <div className="absolute inset-0 bg-black/80 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <h3 className="text-sm font-semibold line-clamp-2">{movie.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span className="text-green-500 font-semibold">98% совпадение</span>
                    <span className="border border-gray-500 px-1">{movie.rating || '16+'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Кнопка вправо */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-40 w-12 bg-black/50 opacity-0 group-hover:opacity-100 hover:bg-black/70 transition flex items-center justify-center -mr-4 sm:-mr-8"
        >
          <ChevronRight size={40} />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
