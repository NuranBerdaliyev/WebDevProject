import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

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

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<Movie[]>(`${this.apiUrl}/`)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http
      .get<Movie>(`${this.apiUrl}/${id}/`)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }
}