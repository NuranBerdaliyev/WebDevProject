import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface MovieLike {
  id: number;
  movie: number;
  movie_title: string;
  like_type: 'like' | 'dislike';
  created_at: string;
}

export interface LikeStatus {
  has_reacted: boolean;
  like_type: 'like' | 'dislike' | null;
}

@Injectable({
  providedIn: 'root'
})
export class MovieLikeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/likes`;

  private readonly likedMoviesSubject = new BehaviorSubject<number[]>([]);
  readonly likedMovies$ = this.likedMoviesSubject.asObservable();

  private readonly dislikedMoviesSubject = new BehaviorSubject<number[]>([]);
  readonly dislikedMovies$ = this.dislikedMoviesSubject.asObservable();

  /**
   * Like a movie
   */
  likeMovie(movieId: number): Observable<MovieLike> {
    return this.http.post<MovieLike>(`${this.apiUrl}/`, {
      movie: movieId,
      like_type: 'like'
    }).pipe(
      tap(() => this.updateLocalState(movieId, 'like')),
      catchError((error) => {
        console.error('Failed to like movie:', error);
        throw error;
      })
    );
  }

  /**
   * Dislike a movie
   */
  dislikeMovie(movieId: number): Observable<MovieLike> {
    return this.http.post<MovieLike>(`${this.apiUrl}/`, {
      movie: movieId,
      like_type: 'dislike'
    }).pipe(
      tap(() => this.updateLocalState(movieId, 'dislike')),
      catchError((error) => {
        console.error('Failed to dislike movie:', error);
        throw error;
      })
    );
  }

  /**
   * Remove like/dislike
   */
  removeReaction(movieId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${movieId}/`).pipe(
      tap(() => this.removeFromLocalState(movieId)),
      catchError((error) => {
        console.error('Failed to remove reaction:', error);
        throw error;
      })
    );
  }

  /**
   * Check if user has liked/disliked a movie
   */
  checkReaction(movieId: number): Observable<LikeStatus> {
    return this.http.get<LikeStatus>(`${this.apiUrl}/check/${movieId}/`).pipe(
      catchError((error) => {
        console.error('Failed to check reaction:', error);
        return of({ has_reacted: false, like_type: null });
      })
    );
  }

  /**
   * Get user's liked movies
   */
  getLikedMovies(): Observable<MovieLike[]> {
    return this.http.get<MovieLike[]>(`${this.apiUrl}/`).pipe(
      catchError((error) => {
        console.error('Failed to get liked movies:', error);
        return of([]);
      })
    );
  }

  /**
   * Toggle like on a movie
   */
  toggleLike(movieId: number): Observable<any> {
    const currentLiked = this.likedMoviesSubject.getValue();
    if (currentLiked.includes(movieId)) {
      return this.removeReaction(movieId);
    }
    return this.likeMovie(movieId);
  }

  /**
   * Check if movie is liked
   */
  isLiked(movieId: number): boolean {
    return this.likedMoviesSubject.getValue().includes(movieId);
  }

  /**
   * Check if movie is disliked
   */
  isDisliked(movieId: number): boolean {
    return this.dislikedMoviesSubject.getValue().includes(movieId);
  }

  private updateLocalState(movieId: number, type: 'like' | 'dislike'): void {
    const liked = this.likedMoviesSubject.getValue();
    const disliked = this.dislikedMoviesSubject.getValue();

    if (type === 'like') {
      if (!liked.includes(movieId)) {
        this.likedMoviesSubject.next([...liked, movieId]);
      }
      this.dislikedMoviesSubject.next(disliked.filter(id => id !== movieId));
    } else {
      if (!disliked.includes(movieId)) {
        this.dislikedMoviesSubject.next([...disliked, movieId]);
      }
      this.likedMoviesSubject.next(liked.filter(id => id !== movieId));
    }
  }

  private removeFromLocalState(movieId: number): void {
    const liked = this.likedMoviesSubject.getValue();
    const disliked = this.dislikedMoviesSubject.getValue();
    this.likedMoviesSubject.next(liked.filter(id => id !== movieId));
    this.dislikedMoviesSubject.next(disliked.filter(id => id !== movieId));
  }
}
