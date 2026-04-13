import { TestBed } from '@angular/core/testing';
import { WatchlistService } from './watchlist.service';

describe('WatchlistService', () => {
  let service: WatchlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchlistService);
  });

  it('should add movie to watchlist', () => {
    service.addToWatchlist(1);
    expect(service.getWatchlist()).toContain(1);
  });

  it('should remove movie from watchlist', () => {
    service.addToWatchlist(2);
    service.removeFromWatchlist(2);
    expect(service.getWatchlist()).not.toContain(2);
  });
});