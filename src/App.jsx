import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import MovieModal from './components/MovieModal';
import VideoPlayer from './components/VideoPlayer';
import Login from './components/Login';
import Footer from './components/Footer';
import { fetchMovies, searchMovies } from './services/api';

function App() {
  const [movies, setMovies] = useState({
    trending: [],
    popular: [],
    topRated: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    // Загружаем избранное из localStorage
    const saved = localStorage.getItem('netflix_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  // Сохраняем избранное в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('netflix_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const loadAllMovies = async () => {
      const [trending, popular, topRated] = await Promise.all([
        fetchMovies('trending'),
        fetchMovies('popular'),
        fetchMovies('topRated')
      ]);

      setMovies({
        trending: trending.slice(0, 12),
        popular: popular.slice(0, 12),
        topRated: topRated.slice(0, 12),
      });
      setLoading(false);
    };

    loadAllMovies();
  }, []);

  // Поиск фильмов - мгновенный
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.length > 0) {
        const results = await searchMovies(searchQuery);
        setSearchResults(results);
        setShowSearch(true);
      } else {
        setShowSearch(false);
        setSearchResults([]);
      }
    };

    handleSearch();
  }, [searchQuery]);

  const toggleFavorite = (movie) => {
    setFavorites(prev => {
      const exists = prev.find(m => m.id === movie.id);
      if (exists) {
        return prev.filter(m => m.id !== movie.id);
      }
      return [...prev, movie];
    });
  };

  const isFavorite = (movie) => {
    return favorites.some(m => m.id === movie?.id);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-netflix-red text-4xl font-bold animate-pulse">
          NETFLIX
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Шапка с поиском */}
      <Header
        onLogout={() => setIsLoggedIn(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showSearch={showSearch}
        onCloseSearch={() => { setShowSearch(false); setSearchQuery(''); }}
      />

      {/* Главный контент */}
      <main>
        {showSearch ? (
          /* Результаты поиска */
          <div className="pt-24 px-4 sm:px-8 lg:px-12">
            <h2 className="text-2xl font-bold mb-6">
              Результаты поиска: "{searchQuery}"
            </h2>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {searchResults.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => setSelectedMovie(movie)}
                    className="movie-card cursor-pointer"
                  >
                    <div className="relative aspect-[2/3] rounded overflow-hidden bg-netflix-dark">
                      <img
                        src={movie.poster_url || '/placeholder.jpg'}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/300x450/333/E50914?text=${encodeURIComponent(movie.title)}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/80 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <h3 className="text-sm font-semibold line-clamp-2">{movie.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          <span className="text-green-500 font-semibold">98% совпадение</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery.length > 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Ничего не найдено по запросу "{searchQuery}"</p>
                <p className="text-gray-500 mt-2">Попробуйте другой запрос или проверьте правописание</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">Введите название фильма для поиска</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Hero секция с избранным фильмом */}
            <Hero onPlayMovie={setCurrentVideo} />

            {/* Ряды с фильмами */}
            <div className="relative z-10 -mt-16 pb-8">
              {/* Мой список (избранное) */}
              {favorites.length > 0 && (
                <MovieRow
                  title="Мой список"
                  movies={favorites}
                  onMovieClick={setSelectedMovie}
                />
              )}
              <MovieRow
                title="Сейчас в тренде"
                movies={movies.trending}
                onMovieClick={setSelectedMovie}
              />
              <MovieRow
                title="Популярное"
                movies={movies.popular}
                onMovieClick={setSelectedMovie}
              />
              <MovieRow
                title="Топ рейтинга"
                movies={movies.topRated}
                onMovieClick={setSelectedMovie}
              />
            </div>
          </>
        )}
      </main>

      {/* Подвал */}
      <Footer />

      {/* Модальное окно фильма */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        isFavorite={isFavorite(selectedMovie)}
        onToggleFavorite={() => selectedMovie && toggleFavorite(selectedMovie)}
        onPlay={() => {
          setCurrentVideo(selectedMovie);
          setSelectedMovie(null);
        }}
      />

      {/* Видео плеер */}
      {currentVideo && (
        <VideoPlayer
          movie={currentVideo}
          onClose={() => setCurrentVideo(null)}
        />
      )}
    </div>
  );
}

export default App;
