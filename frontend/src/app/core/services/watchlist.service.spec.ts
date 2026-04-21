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