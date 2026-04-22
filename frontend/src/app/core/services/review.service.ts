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

  private normalizeReview(review: any): Review {
    return {
      ...review,
      movie_id: review.movie_id ?? review.movie,
      title: review.title ?? '',
      helpful_count: review.helpful_count ?? 0,
      user_helpful: review.user_helpful ?? false,
      username: typeof review.user === 'string' ? review.user : review.user?.username,
      stars: review.rating
    } as Review;
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
      .get<any>('reviews/', { movie: movieId, ...(params ?? {}) })
      .pipe(
        map((response) => {
          if (Array.isArray(response)) {
            const results = response.map((review) => this.normalizeReview(review));
            return {
              count: results.length,
              next: null,
              previous: null,
              results
            } as PaginatedResponse<Review>;
          }

          return {
            ...response,
            results: (response.results ?? []).map((review: any) => this.normalizeReview(review))
          } as PaginatedResponse<Review>;
        }),
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getReviewsByMovie(movieId: number): Observable<Review[]> {
    return this.getReviews(movieId).pipe(map((response) => response.results));
  }

  createReview(movieId: number, reviewData: CreateReviewData): Observable<Review> {
    this.loadingSubject.next(true);

    const payload = {
      movie: movieId,
      rating: reviewData.rating,
      text: reviewData.text ?? ''
    };

    return this.api
      .post<any>('reviews/', payload)
      .pipe(
        map((review) => this.normalizeReview(review)),
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  updateReview(movieId: number, reviewId: number, reviewData: CreateReviewData): Observable<Review> {
    this.loadingSubject.next(true);

    const payload = {
      movie: movieId,
      rating: reviewData.rating,
      text: reviewData.text ?? ''
    };

    return this.api
      .put<any>(`reviews/${reviewId}/`, payload)
      .pipe(
        map((review) => this.normalizeReview(review)),
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  deleteReview(_movieId: number, reviewId: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.api
      .delete<void>(`reviews/${reviewId}/`)
      .pipe(
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }
}