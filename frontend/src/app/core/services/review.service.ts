import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, BehaviorSubject, finalize } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Review } from '../models/review.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly apiUrl = `${environment.apiUrl}/reviews`;

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  getReviews(): Observable<Review[]> {
    this.loadingSubject.next(true);

    return this.http
      .get<Review[]>(`${this.apiUrl}/`)
      .pipe(
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getReviewById(id: number): Observable<Review> {
    this.loadingSubject.next(true);

    return this.http
      .get<Review>(`${this.apiUrl}/${id}/`)
      .pipe(
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  createReview(reviewData: Omit<Review, 'id' | 'created_at'>): Observable<Review> {
    this.loadingSubject.next(true);

    return this.http
      .post<Review>(`${this.apiUrl}/`, reviewData)
      .pipe(
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  deleteReview(id: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.http
      .delete<void>(`${this.apiUrl}/${id}/`)
      .pipe(
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }
}