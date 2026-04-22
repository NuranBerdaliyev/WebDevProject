import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, of, tap } from 'rxjs';

import { Movie, PaginatedResponse } from '../models/movie.model';
import { ErrorHandlerService } from './error-handler.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly api = inject(ApiService);
  private readonly errorHandler = inject(ErrorHandlerService);

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private readonly moviesSubject = new BehaviorSubject<Movie[]>([]);
  readonly movies$ = this.moviesSubject.asObservable();

  private cacheLoaded = false;

  // 🔥 Главный метод
  getMovies(
    forceRefresh: boolean = false,
    params?: {
      search?: string;
      genre?: string;
      sort?: string;
      page?: number;
      limit?: number;
    }
  ): Observable<PaginatedResponse<Movie>> {

    if (this.cacheLoaded && !forceRefresh && !params) {
      return of({
        count: this.moviesSubject.value.length,
        next: null,
        previous: null,
        results: this.moviesSubject.value
      });
    }

    this.loadingSubject.next(true);

    return this.api
      .get<PaginatedResponse<Movie>>('movies/', params)
      .pipe(
        tap((response) => {
          // сохраняем только если это обычный запрос без фильтров
          if (!params) {
            this.moviesSubject.next(response.results);
            this.cacheLoaded = true;
          }
        }),
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

 
  getMovieById(id: number): Observable<Movie> {
    this.loadingSubject.next(true);

    return this.api
      .get<Movie>(`movies/${id}/`)
      .pipe(
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  clearCache(): void {
    this.moviesSubject.next([]);
    this.cacheLoaded = false;
  }
}