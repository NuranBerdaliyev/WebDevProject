export interface Review {
    id: number;
    movie: number;
    user: number;
    rating: number;
    text: string;
    created_at: string;
    // Optional fields from backend
    username?: string;
    user_name?: string;
    stars?: number;
  }