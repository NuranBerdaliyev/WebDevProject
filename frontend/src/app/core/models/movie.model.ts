export interface GenreSummary {
  id: number;
  name: string;
  slug: string;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  rating: number;
  genre: GenreSummary;
  poster_url: string | null;
  backdrop_url: string | null;
  duration_minutes: number;
  director: string;
  cast: string[];
  reviews_count: number;
  is_in_watchlist: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
