import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { WatchlistService } from './watchlist.service';
import { ApiService } from './api.service';
import { ErrorHandlerService } from './error-handler.service';

describe('WatchlistService', () => {
  let service: WatchlistService;
  let apiServiceMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let errorHandlerMock: {
    handleError: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiServiceMock = {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn()
    };

    errorHandlerMock = {
      handleError: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        WatchlistService,
        { provide: ApiService, useValue: apiServiceMock },
        { provide: ErrorHandlerService, useValue: errorHandlerMock }
      ]
    });

    service = TestBed.inject(WatchlistService);
  });

  it('should add movie to watchlist', () => {
    apiServiceMock.post.mockReturnValue(
      of({ id: 1, movie_id: 1, added_at: '2026-04-21T10:00:00Z' })
    );

    service.addToWatchlist(1).subscribe();

    expect(service.currentWatchlist.some(movie => movie.id === 1)).toBe(true);
  });

  it('should remove movie from watchlist', () => {
    apiServiceMock.post.mockReturnValue(
      of({ id: 1, movie_id: 1, added_at: '2026-04-21T10:00:00Z' })
    );
    apiServiceMock.delete.mockReturnValue(of(void 0));

    service.addToWatchlist(1).subscribe();
    service.removeFromWatchlist(1).subscribe();

    expect(service.currentWatchlist.some(movie => movie.id === 1)).toBe(false);
  });
});