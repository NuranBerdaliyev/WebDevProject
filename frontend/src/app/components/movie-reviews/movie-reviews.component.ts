import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

import { ReviewService } from '../../core/services/review.service';
import { Review } from '../../core/models/review.model';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

interface ReviewFormData {
  movie: number;
  rating: number;
  text: string;
}

@Component({
  selector: 'app-movie-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reviews-container">
      <h3 class="reviews-title">Reviews</h3>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-state">
        <span class="spinner"></span>
        <span>Loading reviews...</span>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="error-state">
        <p>{{ error }}</p>
        <button (click)="loadReviews()" class="btn-retry">Retry</button>
      </div>

      <!-- Add Review Form -->
      <div *ngIf="isAuthenticated && !loading && !error" class="add-review-section">
        <div *ngIf="!showAddForm">
          <button (click)="showAddForm = true" class="btn-add-review">Write a Review</button>
        </div>

        <div *ngIf="showAddForm" class="review-form">
          <h4>Add Review</h4>
          <div class="form-group">
            <label>Rating:</label>
            <div class="rating-input">
              <button
                *ngFor="let star of [1,2,3,4,5]"
                (click)="newReview.rating = star"
                [class.active]="newReview.rating >= star"
                class="star-btn"
              >
                ★
              </button>
            </div>
            <span class="rating-value">{{ newReview.rating }}/5</span>
          </div>
          <div class="form-group">
            <label>Your Review:</label>
            <textarea
              [(ngModel)]="newReview.text"
              rows="4"
              placeholder="Write your review here..."
              maxlength="1000"
            ></textarea>
            <span class="char-count">{{ newReview.text.length }}/1000</span>
          </div>
          <div class="form-actions">
            <button (click)="submitReview()" [disabled]="!newReview.text.trim() || newReview.rating === 0" class="btn-submit">
              Submit
            </button>
            <button (click)="cancelAdd()" class="btn-cancel">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Login Prompt -->
      <div *ngIf="!isAuthenticated && !loading" class="login-prompt">
        <p>Please log in to write a review</p>
      </div>

      <!-- Reviews List -->
      <div *ngIf="!loading && !error" class="reviews-list">
        <div *ngIf="reviews.length === 0" class="no-reviews">
          No reviews yet. Be the first to write one!
        </div>

        <div *ngFor="let review of reviews" class="review-item">
          <!-- View Mode -->
          <div *ngIf="editingReview?.id !== review.id" class="review-content">
            <div class="review-header">
              <div class="review-user">
                <span class="username">{{ review.user.username || 'Anonymous' }}</span>
                <div class="review-rating">
                  <span *ngFor="let star of [1,2,3,4,5]" class="star" [class.filled]="getStars(review.rating) >= star">
                    ★
                  </span>
                </div>
              </div>
              <span class="review-date">{{ formatDate(review.created_at) }}</span>
            </div>
            <p class="review-text">{{ review.text }}</p>
            <div class="review-actions" *ngIf="canEditReview(review)">
              <button (click)="startEdit(review)" class="btn-edit">Edit</button>
              <button (click)="deleteReview(review.id)" class="btn-delete">Delete</button>
            </div>
          </div>

          <!-- Edit Mode -->
          <div *ngIf="editingReview?.id === review.id" class="review-edit">
            <div class="form-group">
              <label>Rating:</label>
              <div class="rating-input">
                <button
                  *ngFor="let star of [1,2,3,4,5]"
                  (click)="setEditRating(star)"
                  [class.active]="getEditRating() >= star"
                  class="star-btn"
                >
                  ★
                </button>
              </div>
            </div>
            <div class="form-group">
              <textarea [(ngModel)]="editData!.text" rows="3" maxlength="1000"></textarea>
            </div>
            <div class="form-actions">
              <button (click)="saveEdit()" [disabled]="!canSaveEdit()" class="btn-submit">Save</button>
              <button (click)="cancelEdit()" class="btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reviews-container {
      color: white;
    }

    .reviews-title {
      font-size: 1.5rem;
      margin-bottom: 20px;
      color: #e5e5e5;
    }

    /* Loading State */
    .loading-state {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 20px;
      color: #a3a3a3;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #333;
      border-top-color: #e50914;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Error State */
    .error-state {
      padding: 20px;
      text-align: center;
      color: #e87c03;
    }

    .btn-retry {
      margin-top: 10px;
      padding: 8px 16px;
      background: #e50914;
      border: none;
      border-radius: 4px;
      color: white;
      cursor: pointer;
    }

    /* Add Review Section */
    .add-review-section {
      margin-bottom: 30px;
    }

    .btn-add-review {
      padding: 10px 20px;
      background: #e50914;
      border: none;
      border-radius: 4px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-add-review:hover {
      background: #f40612;
    }

    .review-form {
      background: #262626;
      padding: 20px;
      border-radius: 8px;
    }

    .review-form h4 {
      margin-bottom: 15px;
      color: #e5e5e5;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #a3a3a3;
    }

    .rating-input {
      display: flex;
      gap: 5px;
    }

    .star-btn {
      background: none;
      border: none;
      color: #333;
      font-size: 24px;
      cursor: pointer;
      transition: color 0.2s;
    }

    .star-btn.active {
      color: #ffd700;
    }

    .rating-value {
      margin-left: 10px;
      color: #e5e5e5;
      font-weight: 600;
    }

    textarea {
      width: 100%;
      padding: 10px;
      background: #333;
      border: 1px solid #444;
      border-radius: 4px;
      color: white;
      resize: vertical;
      font-family: inherit;
    }

    textarea:focus {
      outline: none;
      border-color: #e50914;
    }

    .char-count {
      display: block;
      text-align: right;
      color: #666;
      font-size: 12px;
      margin-top: 5px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
    }

    .btn-submit, .btn-cancel {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-submit {
      background: #e50914;
      color: white;
    }

    .btn-submit:hover:not(:disabled) {
      background: #f40612;
    }

    .btn-submit:disabled {
      background: #666;
      cursor: not-allowed;
    }

    .btn-cancel {
      background: #444;
      color: white;
    }

    .btn-cancel:hover {
      background: #555;
    }

    /* Login Prompt */
    .login-prompt {
      padding: 20px;
      text-align: center;
      color: #a3a3a3;
      background: #262626;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    /* Reviews List */
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .no-reviews {
      padding: 30px;
      text-align: center;
      color: #a3a3a3;
      background: #262626;
      border-radius: 8px;
    }

    .review-item {
      background: #262626;
      padding: 20px;
      border-radius: 8px;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .review-user {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .username {
      font-weight: 600;
      color: #e5e5e5;
    }

    .review-rating {
      display: flex;
      gap: 2px;
    }

    .star {
      color: #333;
      font-size: 18px;
    }

    .star.filled {
      color: #ffd700;
    }

    .review-date {
      color: #666;
      font-size: 14px;
    }

    .review-text {
      color: #d2d2d2;
      line-height: 1.5;
      margin-bottom: 10px;
    }

    .review-actions {
      display: flex;
      gap: 10px;
    }

    .btn-edit, .btn-delete {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
    }

    .btn-edit {
      background: #444;
      color: white;
    }

    .btn-edit:hover {
      background: #555;
    }

    .btn-delete {
      background: transparent;
      color: #e50914;
      border: 1px solid #e50914;
    }

    .btn-delete:hover {
      background: #e50914;
      color: white;
    }

    .review-edit {
      padding: 10px 0;
    }
  `]
})
export class MovieReviewsComponent implements OnInit, OnDestroy {
  @Input() movieId!: number;

  private reviewService = inject(ReviewService);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  reviews: Review[] = [];
  loading = false;
  error: string | null = null;
  isAuthenticated = false;
  showAddForm = false;
  currentUserId: number | null = null;

  newReview: ReviewFormData = {
    movie: 0,
    rating: 0,
    text: ''
  };

  editingReview: Review | null = null;
  editData: { rating: number; text: string } = {
    rating: 0,
    text: ''
  };

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();

    // Subscribe to auth changes
    const authSub = this.authService.isAuthenticated$.subscribe(
      auth => {
        this.isAuthenticated = auth;
        if (auth) {
          this.loadCurrentUser();
        }
      }
    );
    this.subscriptions.push(authSub);

    this.loadReviews();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private loadCurrentUser(): void {
    const user = this.userService.getCachedUser();
    if (user) {
      this.currentUserId = user.id;
    }
  }

  loadReviews(): void {
    this.loading = true;
    this.error = null;

    this.reviewService.getReviews(this.movieId).subscribe({
      next: (response: any) => {
        this.reviews = response.results || response;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err?.message || 'Failed to load reviews';
        this.loading = false;
      }
    });
  }

  submitReview(): void {
    if (!this.newReview.text.trim() || this.newReview.rating === 0) return;

    const reviewData = {
      rating: this.newReview.rating,
      title: 'User Review',
      text: this.newReview.text.trim()
    };

    this.reviewService.createReview(this.movieId, reviewData).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.cancelAdd();
      },
      error: (err: any) => {
        this.error = err?.message || 'Failed to submit review';
      }
    });
  }

  cancelAdd(): void {
    this.showAddForm = false;
    this.newReview = { movie: 0, rating: 0, text: '' };
  }

  startEdit(review: Review): void {
    this.editingReview = review;
    // Конвертируем backend rating (1-10) в stars (1-5)
    this.editData = {
      rating: Math.round(review.rating / 2), // Convert 1-10 to 1-5
      text: review.text
    };
  }

  saveEdit(): void {
    if (!this.editingReview || !this.editData.text?.trim()) return;

    this.reviewService.updateReview(this.movieId, this.editingReview.id, {
      rating: this.editData.rating,
      title: this.editingReview.title,
      text: this.editData.text
    }).subscribe({
      next: (updated) => {
        const index = this.reviews.findIndex(r => r.id === updated.id);
        if (index !== -1) {
          this.reviews[index] = updated;
        }
        this.cancelEdit();
      },
      error: (err: any) => {
        this.error = err?.message || 'Failed to update review';
      }
    });
  }

  cancelEdit(): void {
    this.editingReview = null;
    this.editData = { rating: 0, text: '' };
  }

  setEditRating(rating: number): void {
    this.editData.rating = rating;
  }

  getEditRating(): number {
    return this.editData?.rating || 0;
  }

  canSaveEdit(): boolean {
    return !!(this.editData?.text?.trim());
  }

  deleteReview(id: number): void {
    if (!confirm('Are you sure you want to delete this review?')) return;

    this.reviewService.deleteReview(this.movieId, id).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== id);
      },
      error: (err: any) => {
        this.error = err?.message || 'Failed to delete review';
      }
    });
  }

  /**
   * Проверка: может ли текущий пользователь редактировать отзыв
   */
  canEditReview(review: Review): boolean {
    // Только автор отзыва может редактировать
    if (!this.isAuthenticated || !this.currentUserId) return false;
    return review.user.id === this.currentUserId;
  }

  /**
   * Конвертировать backend rating (1-10) в звезды (1-5)
   */
  getStars(rating: number): number {
    return Math.min(5, Math.max(1, Math.round(rating / 2)));
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
