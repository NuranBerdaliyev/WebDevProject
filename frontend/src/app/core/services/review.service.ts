import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

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

  getReviews(): Observable<Review[]> {
    return this.http
      .get<Review[]>(`${this.apiUrl}/`)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  getReviewById(id: number): Observable<Review> {
    return this.http
      .get<Review>(`${this.apiUrl}/${id}/`)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  createReview(reviewData: Omit<Review, 'id' | 'created_at'>): Observable<Review> {
    return this.http
      .post<Review>(`${this.apiUrl}/`, reviewData)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  deleteReview(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}/`)
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }
}