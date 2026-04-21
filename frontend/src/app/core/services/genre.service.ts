import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, BehaviorSubject, finalize } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Genre } from '../models/genre.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private readonly http = inject(HttpClient);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly apiUrl = `${environment.apiUrl}/genres`;

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  getGenres(): Observable<Genre[]> {
    this.loadingSubject.next(true);

    return this.http
      .get<Genre[]>(`${this.apiUrl}/`)
      .pipe(
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getGenreById(id: number): Observable<Genre> {
    this.loadingSubject.next(true);

    return this.http
      .get<Genre>(`${this.apiUrl}/${id}/`)
      .pipe(
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }
}