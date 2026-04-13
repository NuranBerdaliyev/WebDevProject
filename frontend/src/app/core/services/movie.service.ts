import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, BehaviorSubject, finalize, of, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Movie } from '../models/movie.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly apiUrl = `${environment.apiUrl}/movies`;

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private readonly moviesSubject = new BehaviorSubject<Movie[]>([]);
  readonly movies$ = this.moviesSubject.asObservable();

  private cacheLoaded = false;

  getMovies(forceRefresh: boolean = false): Observable<Movie[]> {
    if (this.cacheLoaded && !forceRefresh) {
      return of(this.moviesSubject.value);
    }

    this.loadingSubject.next(true);

    return this.http
      .get<Movie[]>(`${this.apiUrl}/`)
      .pipe(
        tap((movies) => {
          this.moviesSubject.next(movies);
          this.cacheLoaded = true;
        }),
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getMovieById(id: number): Observable<Movie> {
    this.loadingSubject.next(true);

    return this.http
      .get<Movie>(`${this.apiUrl}/${id}/`)
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