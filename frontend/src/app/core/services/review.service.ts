import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/reviews`;

  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/`);
  }

  getReviewById(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}/`);
  }

  createReview(reviewData: Omit<Review, 'id' | 'created_at'>): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/`, reviewData);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}