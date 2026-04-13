import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';

export interface Movie {
  id: number;
  title: string;
  description: string;
  image: string;
  backdrop?: string;
  rating: number;
  year: number;
  duration: string;
  genre: string[];
  cast: string[];
  director: string;
  videoUrl?: string;
}

const MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&q=80",
    backdrop: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1280&q=80",
    rating: 8.7,
    year: 2016,
    duration: "50m",
    genre: ["Sci-Fi", "Horror", "Drama"],
    cast: ["Winona Ryder", "David Harbour", "Finn Wolfhard"],
    director: "The Duffer Brothers",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    id: 2,
    title: "The Witcher",
    description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e4a1b?w=500&q=80",
    rating: 8.2,
    year: 2019,
    duration: "1h",
    genre: ["Fantasy", "Action", "Adventure"],
    cast: ["Henry Cavill", "Anya Chalotra", "Freya Allan"],
    director: "Lauren Schmidt Hissrich",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    id: 3,
    title: "Black Mirror",
    description: "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
    image: "https://images.unsplash.com/photo-1535016120720-40c6874c3b13?w=500&q=80",
    rating: 8.8,
    year: 2011,
    duration: "1h",
    genre: ["Sci-Fi", "Thriller", "Drama"],
    cast: ["Various Cast"],
    director: "Charlie Brooker",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    id: 4,
    title: "Money Heist",
    description: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
    image: "https://images.unsplash.com/photo-1560167016-022b78a0258e?w=500&q=80",
    rating: 8.2,
    year: 2017,
    duration: "1h 10m",
    genre: ["Crime", "Thriller", "Action"],
    cast: ["Úrsula Corberó", "Álvaro Morte", "Itziar Ituño"],
    director: "Álex Pina"
  },
  {
    id: 5,
    title: "Wednesday",
    description: "Follows Wednesday Addams' years as a student, when she attempts to master her emerging psychic ability, thwart a killing spree, and solve the mystery that embroiled her parents.",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500&q=80",
    rating: 8.1,
    year: 2022,
    duration: "50m",
    genre: ["Comedy", "Horror", "Fantasy"],
    cast: ["Jenna Ortega", "Gwendoline Christie", "Riki Lindhome"],
    director: "Tim Burton"
  },
  {
    id: 6,
    title: "Squid Game",
    description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80",
    rating: 8.0,
    year: 2021,
    duration: "1h",
    genre: ["Thriller", "Drama", "Action"],
    cast: ["Lee Jung-jae", "Park Hae-soo", "Wi Ha-joon"],
    director: "Hwang Dong-hyuk"
  },
  {
    id: 7,
    title: "Dark",
    description: "A family saga with a supernatural twist, set in a German town where the disappearance of two young children exposes the relationships among four families.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80",
    rating: 8.8,
    year: 2017,
    duration: "1h",
    genre: ["Sci-Fi", "Mystery", "Thriller"],
    cast: ["Louis Hofmann", "Oliver Masucci", "Jördis Triebel"],
    director: "Baran bo Odar"
  },
  {
    id: 8,
    title: "Ozark",
    description: "A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a drug boss.",
    image: "https://images.unsplash.com/photo-1550100136-e074fa43d818?w=500&q=80",
    rating: 8.5,
    year: 2017,
    duration: "1h",
    genre: ["Crime", "Drama", "Thriller"],
    cast: ["Jason Bateman", "Laura Linney", "Sofia Hublitz"],
    director: "Bill Dubuque"
  },
  {
    id: 9,
    title: "The Crown",
    description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&q=80",
    rating: 8.6,
    year: 2016,
    duration: "1h",
    genre: ["Drama", "Biography", "History"],
    cast: ["Claire Foy", "Olivia Colman", "Imelda Staunton"],
    director: "Peter Morgan"
  },
  {
    id: 10,
    title: "Mindhunter",
    description: "Set in the late 1970s, two FBI agents are tasked with interviewing serial killers to solve open cases.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&q=80",
    rating: 8.6,
    year: 2017,
    duration: "1h",
    genre: ["Crime", "Drama", "Thriller"],
    cast: ["Jonathan Groff", "Holt McCallany", "Anna Torv"],
    director: "Joe Penhall"
  },
  {
    id: 11,
    title: "Narcos",
    description: "A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar, as well as the many other drug kingpins who plagued the country through the years.",
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&q=80",
    rating: 8.4,
    year: 2015,
    duration: "1h",
    genre: ["Crime", "Drama", "Biography"],
    cast: ["Wagner Moura", "Pedro Pascal", "Boyd Holbrook"],
    director: "Chris Brancato"
  },
  {
    id: 12,
    title: "The Queen's Gambit",
    description: "Orphaned at the tender age of nine, prodigious introvert Beth Harmon discovers and masters the game of chess in 1960s USA.",
    image: "https://images.unsplash.com/photo-1586165368502-1d197b8d1258?w=500&q=80",
    rating: 8.6,
    year: 2020,
    duration: "1h",
    genre: ["Drama"],
    cast: ["Anya Taylor-Joy", "Chloe Pirrie", "Bill Camp"],
    director: "Scott Frank"
  }
];

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private movies = new BehaviorSubject<Movie[]>(MOCK_MOVIES);
  private favorites = new BehaviorSubject<number[]>([]);
  private loading = new BehaviorSubject<boolean>(false);

  movies$ = this.movies.asObservable();
  favorites$ = this.favorites.asObservable();
  loading$ = this.loading.asObservable();

  getTrending(): Observable<Movie[]> {
    return of(MOCK_MOVIES.slice(0, 6)).pipe(delay(500));
  }

  getPopular(): Observable<Movie[]> {
    return of(MOCK_MOVIES.slice(6, 12)).pipe(delay(500));
  }

  getTopRated(): Observable<Movie[]> {
    return of([...MOCK_MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 6)).pipe(delay(500));
  }

  searchMovies(query: string): Observable<Movie[]> {
    if (!query.trim()) {
      return of([]);
    }
    const filtered = MOCK_MOVIES.filter(m =>
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
    );
    return of(filtered).pipe(delay(300));
  }

  addToFavorites(movieId: number): void {
    const current = this.favorites.getValue();
    if (!current.includes(movieId)) {
      this.favorites.next([...current, movieId]);
    }
  }

  removeFromFavorites(movieId: number): void {
    const current = this.favorites.getValue();
    this.favorites.next(current.filter(id => id !== movieId));
  }

  isFavorite(movieId: number): boolean {
    return this.favorites.getValue().includes(movieId);
  }

  setLoading(loading: boolean): void {
    this.loading.next(loading);
  }
}
