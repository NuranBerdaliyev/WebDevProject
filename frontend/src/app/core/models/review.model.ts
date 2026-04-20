export interface ReviewUser {
  id: number;
  username: string;
  avatar_url: string | null;
}

export interface Review {
  id: number;
  movie_id: number;
  user: ReviewUser;
  rating: number;
  title: string;
  text: string;
  helpful_count: number;
  user_helpful: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  rating: number;
  title: string;
  text?: string;
}