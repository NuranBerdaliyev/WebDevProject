import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, map } from 'rxjs';

import { Review, CreateReviewData } from '../models/review.model';
import { PaginatedResponse } from '../models/movie.model';
import { ErrorHandlerService } from './error-handler.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly api = inject(ApiService);
  private readonly errorHandler = inject(ErrorHandlerService);

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private normalizeReview(review: Review): Review {
    return {
      ...review,
      username: review.user?.username,
      stars: review.rating
    };
  }

  getReviews(
    movieId: number,
    params?: {
      sort?: string;
      page?: number;
      limit?: number;
    }
  ): Observable<PaginatedResponse<Review>> {
    this.loadingSubject.next(true);

    return this.api
      .get<PaginatedResponse<Review>>(`movies/${movieId}/reviews/`, params)
      .pipe(
        map((response) => ({
          ...response,
          results: response.results.map((review) => this.normalizeReview(review))
        })),
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  // совместимость со старым movie-reviews.component.ts
  getReviewsByMovie(movieId: number): Observable<Review[]> {
    return this.getReviews(movieId).pipe(
      map((response) => response.results)
    );
  }

  createReview(movieId: number, reviewData: CreateReviewData): Observable<Review> {
    this.loadingSubject.next(true);

    return this.api
      .post<Review>(`movies/${movieId}/reviews/`, reviewData)
      .pipe(
        map((review) => this.normalizeReview(review)),
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  updateReview(movieId: number, reviewId: number, reviewData: CreateReviewData): Observable<Review> {
    this.loadingSubject.next(true);

    return this.api
      .put<Review>(`movies/${movieId}/reviews/${reviewId}/`, reviewData)
      .pipe(
        map((review) => this.normalizeReview(review)),
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  deleteReview(movieId: number, reviewId: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.api
      .delete<void>(`movies/${movieId}/reviews/${reviewId}/`)
      .pipe(
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }
}