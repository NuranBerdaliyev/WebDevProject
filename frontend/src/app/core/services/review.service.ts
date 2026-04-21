<<<<<<< HEAD
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize } from 'rxjs';

import { Review, CreateReviewData } from '../models/review.model';
import { PaginatedResponse } from '../models/movie.model';
import { ErrorHandlerService } from './error-handler.service';
import { ApiService } from './api.service';
=======
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, BehaviorSubject, finalize } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Review } from '../models/review.model';
import { ErrorHandlerService } from './error-handler.service';
>>>>>>> develop

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
<<<<<<< HEAD
  private readonly api = inject(ApiService);
  private readonly errorHandler = inject(ErrorHandlerService);
=======
  private readonly http = inject(HttpClient);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly apiUrl = `${environment.apiUrl}/reviews`;
>>>>>>> develop

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

<<<<<<< HEAD
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
=======
  getReviews(): Observable<Review[]> {
    this.loadingSubject.next(true);

    return this.http
      .get<Review[]>(`${this.apiUrl}/`)
>>>>>>> develop
      .pipe(
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  createReview(movieId: number, reviewData: CreateReviewData): Observable<Review> {
    this.loadingSubject.next(true);

    return this.api
      .post<Review>(`movies/${movieId}/reviews/`, reviewData)
      .pipe(
        catchError((error) => this.errorHandler.handleError(error)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  updateReview(movieId: number, reviewId: number, reviewData: CreateReviewData): Observable<Review> {
    this.loadingSubject.next(true);

    return this.api
      .put<Review>(`movies/${movieId}/reviews/${reviewId}/`, reviewData)
      .pipe(
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