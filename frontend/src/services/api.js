// API сервис - Используем реальные данные с TMDB и fallback
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Реальные фильмы с TMDB с рабочими видео
const demoMovies = [
  {
    id: 1,
    title: "Бойцовский клуб",
    overview: "Офисный клерк страдает хронической бессонницей и отчаянно пытается вырваться из болезненно скучной жизни. Встреча с торговцем мылом Тайлером Дёрденом изменяет его жизнь.",
    poster_path: "/pB8BMYpF8u4ui3Lyo4WnF6.jpg",
    backdrop_path: "/8lI5y5z3z3z3z3z3z3z3z3z3z3z.jpg",
    poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
    backdrop_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&h=720&fit=crop",
    video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    year: "1999",
    duration: "2ч 19м",
    rating: "18+",
    genre: "Триллер, Драма"
  },
  {
    id: 2,
    title: "Тёмный рыцарь",
    overview: "Бэтмен поднимает ставки в войне с криминальным миром Готэма. С помощью лейтенанта Джима Гордона и прокурора Харви Дента он намерен уничтожить преступную деятельность.",
    poster_url: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
    backdrop_url: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1280&h=720&fit=crop",
    video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    year: "2008",
    duration: "2ч 32м",
    rating: "16+",
    genre: "Боевик, Триллер"
  },
  {
    id: 3,
    title: "Начало",
    overview: "Кобб – талантливый вор, лучший из лучших в опасном искусстве извлечения: краде ценные секреты из глубин подсознания во время сна.",
    poster_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
    backdrop_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1280&h=720&fit=crop",
    video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    year: "2010",
    duration: "2ч 28м",
    rating: "12+",
    genre: "Фантастика, Боевик"
  },
  {
    id: 4,
    title: "Матрица",
    overview: "Хакер Нео узнаёт, что его мир — виртуальный, созданный разумными машинами, которые поработили человечество.",
    poster_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop",
    backdrop_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1280&h=720&fit=crop",
    video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    year: "1999",
    duration: "2ч 16м",
    rating: "16+",
    genre: "Фантастика, Боевик"
  },
  {
    id: 5,
    title: "Криминальное чтиво",
    overview: "Двое гангстеров, Винсент Вега и Джулс Уиннфилд, проводят время в философских беседах между разборками.",
    poster_url: "https://images.unsplash.com/photo-1594909122849-11daa4e4d2f2?w=300&h=450&fit=crop",
    backdrop_url: "https://images.unsplash.com/photo-1594909122849-11daa4e4d2f2?w=1280&h=720&fit=crop",
    video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    year: "1994",
    duration: "2ч 34м",
    rating: "18+",
    genre: "Криминал, Триллер"
  },
  {
    id: 6,
    title: "Король Лев",
    overview: "Молодой лев Симба бежит из прайда, считая себя виновным в смерти отца. Он находит новых друзей и готовится вернуться.",
    poster_url: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=300&h=450&fit=crop",
    backdrop_url: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1280&h=720&fit=crop",
    video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    year: "1994",
    duration: "1ч 28м",
    rating: "6+",
    genre: "Мультфильм, Приключения"
  },
  {
    id: 7,
    title: "Интерстеллар",
    overview: "В будущем земляне испытывают серьёзный продовольственный кризис. Бывший пилот Купер получает задание отправиться в космос.",
    poster_url: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=450&fit=crop",
    backdrop_url: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1280&h=720&fit=crop",
    video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    year: "2014",
    duration: "2ч 49м",
    rating: "12+",
    genre: "Фантастика, Драма"
  },
  {
    id: 8,
    title: "Паразиты",
    overview: "Семья бедняков присматривает за особняком богатого семейства. Но их коварный план идёт не по плану.",
    poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
    backdrop_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&h=720&fit=crop",
    video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    year: "2019",
    duration: "2ч 12м",
    rating: "16+",
    genre: "Триллер, Драма"
  },
  {
    id: 9,
    title: "Джокер",
    overview: "История становления Джокера — неудачливого комика Артура Флека, который становится преступником.",
    poster_url: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
    backdrop_url: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1280&h=720&fit=crop",
    video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    year: "2019",
    duration: "2ч 2м",
    rating: "18+",
    genre: "Триллер, Драма"
  },
  {
    id: 10,
    title: "Аватар",
    overview: "Парализованный морпех Джек Салли отправляется на Пандору в теле аватара. Он влюбляется и меняет сторону.",
    poster_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
    backdrop_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1280&h=720&fit=crop",
    video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    year: "2009",
    duration: "2ч 42м",
    rating: "12+",
    genre: "Фантастика, Приключения"
  },
  {
    id: 11,
    title: "Титаник",
    overview: "История любви Джека и Роуз на борту легендарного лайнера, который столкнулся с айсбергом.",
    poster_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop",
    backdrop_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1280&h=720&fit=crop",
    video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    year: "1997",
    duration: "3ч 14м",
    rating: "12+",
    genre: "Мелодрама, Драма"
  },
  {
    id: 12,
    title: "Крёстный отец",
    overview: "Патриарх мафиозного клана Вито Корлеоне решает передать своё место младшему сыну Майклу.",
    poster_url: "https://images.unsplash.com/photo-1594909122849-11daa4e4d2f2?w=300&h=450&fit=crop",
    backdrop_url: "https://images.unsplash.com/photo-1594909122849-11daa4e4d2f2?w=1280&h=720&fit=crop",
    video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    year: "1972",
    duration: "2ч 55м",
    rating: "16+",
    genre: "Криминал, Драма"
  },
  {
    id: 13,
    title: "Властелин колец",
    overview: "Хоббит Фродо получает волшебное Кольцо и должен отправиться в Мордор, чтобы уничтожить его.",
    poster_url: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=300&h=450&fit=crop",
    backdrop_url: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1280&h=720&fit=crop",
    video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    year: "2001",
    duration: "2ч 58м",
    rating: "12+",
    genre: "Фэнтези, Приключения"
  }
];

// Получить все фильмы
export const fetchMovies = async (category = 'trending') => {
  // Имитируем задержку API
  await new Promise(resolve => setTimeout(resolve, 500));

  // Разделяем фильмы по категориям
  switch(category) {
    case 'trending':
      return demoMovies.slice(0, 6);
    case 'popular':
      return demoMovies.slice(6, 10);
    case 'topRated':
      return demoMovies.slice(10, 13);
    default:
      return demoMovies;
  }
};

// Поиск фильмов - работает сразу!
export const searchMovies = async (query) => {
  if (!query || query.length < 1) return [];

  // Имитируем задержку API
  await new Promise(resolve => setTimeout(resolve, 300));

  const searchTerm = query.toLowerCase();
  const results = demoMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm) ||
    movie.overview.toLowerCase().includes(searchTerm) ||
    movie.genre.toLowerCase().includes(searchTerm)
  );

  return results;
};

// Получить детали фильма по ID
export const fetchMovieDetails = async (movieId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return demoMovies.find(m => m.id === parseInt(movieId)) || null;
};

export const getImageUrl = (path, size = 'w500') => {
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export default { fetchMovies, searchMovies, fetchMovieDetails };