import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private readonly storageKey = 'watchlist_movie_ids';

  private readonly watchlistSubject = new BehaviorSubject<number[]>(this.getStoredWatchlist());
  readonly watchlist$ = this.watchlistSubject.asObservable();

  getWatchlist(): number[] {
    return this.watchlistSubject.value;
  }

  addToWatchlist(movieId: number): void {
    const current = this.watchlistSubject.value;

    if (current.includes(movieId)) {
      return;
    }

    const updated = [...current, movieId];
    this.watchlistSubject.next(updated);
    this.saveWatchlist(updated);
  }

  removeFromWatchlist(movieId: number): void {
    const updated = this.watchlistSubject.value.filter((id) => id !== movieId);
    this.watchlistSubject.next(updated);
    this.saveWatchlist(updated);
  }

  isInWatchlist(movieId: number): boolean {
    return this.watchlistSubject.value.includes(movieId);
  }

  toggleWatchlist(movieId: number): void {
    if (this.isInWatchlist(movieId)) {
      this.removeFromWatchlist(movieId);
    } else {
      this.addToWatchlist(movieId);
    }
  }

  clearWatchlist(): void {
    this.watchlistSubject.next([]);
    localStorage.removeItem(this.storageKey);
  }

  private saveWatchlist(movieIds: number[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(movieIds));
  }

  private getStoredWatchlist(): number[] {
    const stored = localStorage.getItem(this.storageKey);

    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        return parsed.filter((id) => typeof id === 'number');
      }

      return [];
    } catch {
      localStorage.removeItem(this.storageKey);
      return [];
    }
  }
}