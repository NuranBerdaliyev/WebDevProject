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

// frontend/src/app/core/services/watchlist.service.spec.ts
// Replace whole file with this:

import { TestBed } from '@angular/core/testing';
import { of, firstValueFrom, throwError } from 'rxjs';

import { WatchlistService } from './watchlist.service';
import { ApiService } from './api.service';
import { ErrorHandlerService } from './error-handler.service';

describe('WatchlistService', () => {
  let service: WatchlistService;

  const apiMock = {
    get: () =>
      of({
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            title: 'Test Movie',
            rating: 8.1,
            poster_url: null,
            added_at: '2026-01-01T00:00:00Z'
          }
        ]
      }),
    post: (_endpoint: string, body: { movie_id: number }) =>
      of({
        id: 99,
        movie_id: body.movie_id,
        added_at: '2026-01-01T00:00:00Z'
      }),
    delete: () => of(void 0)
  };

  const errorHandlerMock = {
    handleError: (error: unknown) => throwError(() => error)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WatchlistService,
        { provide: ApiService, useValue: apiMock },
        { provide: ErrorHandlerService, useValue: errorHandlerMock }
      ]
    });

    service = TestBed.inject(WatchlistService);
  });

  it('should load watchlist', async () => {
    const response = await firstValueFrom(service.getWatchlist());
    expect(response.results.length).toBe(1);
    expect(response.results[0].id).toBe(1);
  });

  it('should add movie to watchlist', async () => {
    const result = await firstValueFrom(service.addToWatchlist(7));
    expect(result.movie_id).toBe(7);
  });

  it('should remove movie from watchlist', async () => {
    const result = await firstValueFrom(service.removeFromWatchlist(7));
    expect(result).toBeUndefined();
  });
});