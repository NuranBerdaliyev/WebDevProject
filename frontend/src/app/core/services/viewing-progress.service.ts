import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface ViewingProgress {
  id: number;
  movie_id: number;
  title: string;
  poster_url: string;
  backdrop_url?: string;
  video_url?: string;
  progress_seconds: number;
  duration_seconds: number | null;
  duration_minutes?: number;
  progress_percentage: number;
  is_completed: boolean;
  last_watched: string;
}

@Injectable({
  providedIn: 'root'
})
export class ViewingProgressService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/progress`;

  private readonly continueWatchingSubject = new BehaviorSubject<ViewingProgress[]>([]);
  readonly continueWatching$ = this.continueWatchingSubject.asObservable();

  /**
   * Get "Continue Watching" list
   */
  getContinueWatching(): Observable<ViewingProgress[]> {
    return this.http.get<ViewingProgress[]>(`${this.apiUrl}/`).pipe(
      catchError((error) => {
        console.error('Failed to load continue watching:', error);
        return of([]);
      })
    );
  }

  /**
   * Get progress for a specific movie
   */
  getMovieProgress(movieId: number): Observable<ViewingProgress | { progress_seconds: number; is_completed: boolean }> {
    return this.http.get<any>(`${this.apiUrl}/movie/${movieId}/`).pipe(
      catchError((error) => {
        console.error('Failed to load movie progress:', error);
        return of({ progress_seconds: 0, is_completed: false });
      })
    );
  }

  /**
   * Update viewing progress
   */
  updateProgress(movieId: number, progressSeconds: number, durationSeconds?: number, isCompleted: boolean = false): Observable<any> {
    const data = {
      movie_id: movieId,
      progress_seconds: Math.floor(progressSeconds),
      duration_seconds: durationSeconds ? Math.floor(durationSeconds) : null,
      is_completed: isCompleted
    };

    return this.http.post(`${this.apiUrl}/update_progress/`, data).pipe(
      catchError((error) => {
        console.error('Failed to update progress:', error);
        return of({ error: true });
      })
    );
  }

  /**
   * Mark movie as completed
   */
  markAsCompleted(movieId: number, durationSeconds: number): Observable<any> {
    return this.updateProgress(movieId, durationSeconds, durationSeconds, true);
  }

  /**
   * Remove from continue watching
   */
  removeFromHistory(movieId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${movieId}/`).pipe(
      catchError((error) => {
        console.error('Failed to remove from history:', error);
        return of({ error: true });
      })
    );
  }

  /**
   * Get full watch history
   */
  getWatchHistory(): Observable<ViewingProgress[]> {
    return this.http.get<ViewingProgress[]>(`${this.apiUrl}/history/`).pipe(
      catchError((error) => {
        console.error('Failed to load watch history:', error);
        return of([]);
      })
    );
  }

  /**
   * Format seconds to readable time (e.g., "1h 30m left" or "45m left")
   */
  formatRemainingTime(progressSeconds: number, durationSeconds: number | null): string {
    if (!durationSeconds || durationSeconds <= 0) {
      return '';
    }

    const remainingSeconds = durationSeconds - progressSeconds;
    if (remainingSeconds <= 0) {
      return 'Completed';
    }

    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }
    return `${minutes}m left`;
  }

  /**
   * Calculate progress bar width percentage
   */
  getProgressBarWidth(progressSeconds: number, durationSeconds: number | null): number {
    if (!durationSeconds || durationSeconds <= 0) {
      return 0;
    }
    return Math.min(100, (progressSeconds / durationSeconds) * 100);
  }
}
