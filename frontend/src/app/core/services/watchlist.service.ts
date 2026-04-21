import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, tap } from 'rxjs';

import { ApiService } from './api.service';
import { ErrorHandlerService } from './error-handler.service';

export interface WatchlistMovie {
  id: number;
  title: string;
  rating: number;
  poster_url: string | null;
  added_at: string;
}

export interface PaginatedWatchlistResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WatchlistMovie[];
}

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private readonly api = inject(ApiService);
  private readonly errorHandler = inject(ErrorHandlerService);

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private readonly watchlistSubject = new BehaviorSubject<WatchlistMovie[]>([]);
  readonly watchlist$ = this.watchlistSubject.asObservable();

  getWatchlist(params?: {
    sort?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<PaginatedWatchlistResponse> {
    this.loadingSubject.next(true);

    return this.api
      .get<PaginatedWatchlistResponse>('watchlist/', params)
      .pipe(
        tap((response) => this.watchlistSubject.next(response.results)),
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  addToWatchlist(movieId: number): Observable<{ id: number; movie_id: number; added_at: string }> {
    this.loadingSubject.next(true);

    return this.api
      .post<{ id: number; movie_id: number; added_at: string }>('watchlist/', { movie_id: movieId })
      .pipe(
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  removeFromWatchlist(movieId: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.api
      .delete<void>(`watchlist/${movieId}/`)
      .pipe(
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }
}