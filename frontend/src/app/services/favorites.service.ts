import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface WatchlistItem {
  id: number;
  movie_id: number;
  title: string;
  rating: number;
  poster_url: string;
  added_at: string;
}

/**
 * Favorites Service
 *
 * Использует backend /api/watchlist/ endpoints для синхронизации избранного.
 * Fallback на localStorage при ошибках backend.
 */
@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/watchlist`;
  private readonly storageKey = 'netflix_favorites';

  private readonly favoritesSubject = new BehaviorSubject<number[]>([]);
  readonly favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    // Загружаем избранное с backend при старте
    this.loadFromBackend();
  }

  /**
   * Загрузить избранное с backend
   */
  private loadFromBackend(): void {
    this.http.get<WatchlistItem[]>(`${this.apiUrl}/`).subscribe({
      next: (items) => {
        const movieIds = items.map(item => item.movie_id);
        this.favoritesSubject.next(movieIds);
        // Кэшируем в localStorage как backup
        this.saveToStorage(movieIds);
      },
      error: () => {
        // Fallback на localStorage если backend недоступен
        this.loadFromStorage();
      }
    });
  }

  /**
   * Загрузить избранное из localStorage (fallback)
   */
  private loadFromStorage(): void {
    const favorites = localStorage.getItem(this.storageKey);
    if (favorites) {
      try {
        const parsed = JSON.parse(favorites);
        if (Array.isArray(parsed)) {
          this.favoritesSubject.next(parsed);
        }
      } catch {
        console.error('Failed to parse favorites from localStorage');
      }
    }
  }

  /**
   * Сохранить избранное в localStorage
   */
  private saveToStorage(favorites: number[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }

  /**
   * Получить ID избранных фильмов
   */
  getFavorites(): number[] {
    return this.favoritesSubject.getValue();
  }

  /**
   * Получить избранное с сервера как объекты
   */
  getWatchlist(): Observable<WatchlistItem[]> {
    return this.http.get<WatchlistItem[]>(`${this.apiUrl}/`).pipe(
      catchError((error) => {
        console.error('Failed to load watchlist from backend:', error);
        return of([]);
      })
    );
  }

  /**
   * Добавить фильм в избранное
   */
  addToFavorites(movieId: number): Observable<any> {
    const current = this.getFavorites();
    if (current.includes(movieId)) {
      return of({ success: true });
    }

    return this.http.post(`${this.apiUrl}/`, { movie_id: movieId }).pipe(
      tap(() => {
        const updated = [...current, movieId];
        this.favoritesSubject.next(updated);
        this.saveToStorage(updated);
      }),
      catchError((error) => {
        console.error('Failed to add to favorites:', error);
        // Fallback: сохраняем локально
        const updated = [...current, movieId];
        this.favoritesSubject.next(updated);
        this.saveToStorage(updated);
        return throwError(() => error);
      })
    );
  }

  /**
   * Удалить фильм из избранного
   */
  removeFromFavorites(movieId: number): Observable<any> {
    const current = this.getFavorites();

    return this.http.delete(`${this.apiUrl}/${movieId}/`).pipe(
      tap(() => {
        const updated = current.filter(id => id !== movieId);
        this.favoritesSubject.next(updated);
        this.saveToStorage(updated);
      }),
      catchError((error) => {
        console.error('Failed to remove from favorites:', error);
        // Fallback: удаляем локально
        const updated = current.filter(id => id !== movieId);
        this.favoritesSubject.next(updated);
        this.saveToStorage(updated);
        return throwError(() => error);
      })
    );
  }

  /**
   * Проверить, находится ли фильм в избранном
   */
  isFavorite(movieId: number): boolean {
    return this.getFavorites().includes(movieId);
  }

  /**
   * Переключить состояние избранного
   */
  toggleFavorite(movieId: number): Observable<any> {
    if (this.isFavorite(movieId)) {
      return this.removeFromFavorites(movieId);
    } else {
      return this.addToFavorites(movieId);
    }
  }

  /**
   * Очистить все избранное
   */
  clearFavorites(): void {
    this.favoritesSubject.next([]);
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Проверить статус избранного на сервере
   */
  checkFavoriteStatus(movieId: number): Observable<boolean> {
    return this.http.get<{ is_in_watchlist: boolean }>(`${this.apiUrl}/check/${movieId}/`).pipe(
      map(response => response.is_in_watchlist),
      catchError(() => of(this.isFavorite(movieId)))
    );
  }
}
