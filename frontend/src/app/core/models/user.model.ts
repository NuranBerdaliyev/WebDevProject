export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  bio: string;
  reviews_count: number;
  watchlist_count: number;
  joined_at: string;
}
