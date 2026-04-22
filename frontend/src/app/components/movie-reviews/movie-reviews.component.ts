import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ReviewService } from '../../core/services/review.service';
import { Review } from '../../core/models/review.model';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

interface ReviewFormData {
  rating: number;   // 1-10
  title: string;
  text: string;
}

@Component({
  selector: 'app-movie-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reviews-container">
      <h3 class="reviews-title">Reviews</h3>

      <div *ngIf="loading" class="loading-state">
        <span class="spinner"></span>
        <span>Loading reviews...</span>
      </div>

      <div *ngIf="error" class="error-state">
        <p>{{ error }}</p>
        <button (click)="loadReviews()" class="btn-retry">Retry</button>
      </div>

      <div *ngIf="isAuthenticated && !loading && !error" class="add-review-section">
        <div *ngIf="!showAddForm">
          <button (click)="showAddForm = true" class="btn-add-review">Write a Review</button>
        </div>

        <div *ngIf="showAddForm" class="review-form">
          <h4>Add Review</h4>

          <div class="form-group">
            <label>Rating (1-10):</label>
            <input
              type="number"
              [(ngModel)]="newReview.rating"
              min="1"
              max="10"
            />
            <span class="rating-value">{{ newReview.rating }}/10</span>
          </div>

          <div class="form-group">
            <label>Title:</label>
            <input
              type="text"
              [(ngModel)]="newReview.title"
              maxlength="200"
              placeholder="Review title"
            />
            <span class="char-count">{{ newReview.title.length }}/200</span>
          </div>

          <div class="form-group">
            <label>Your Review:</label>
            <textarea
              [(ngModel)]="newReview.text"
              rows="4"
              placeholder="Write your review here..."
              maxlength="5000"
            ></textarea>
            <span class="char-count">{{ newReview.text.length }}/5000</span>
          </div>

          <div class="form-actions">
            <button
              (click)="submitReview()"
              [disabled]="!canSubmitReview()"
              class="btn-submit"
            >
              Submit
            </button>
            <button (click)="cancelAdd()" class="btn-cancel">Cancel</button>
          </div>
        </div>
      </div>

      <div *ngIf="!isAuthenticated && !loading" class="login-prompt">
        <p>Please log in to write a review</p>
      </div>

      <div *ngIf="!loading && !error" class="reviews-list">
        <div *ngIf="reviews.length === 0" class="no-reviews">
          No reviews yet. Be the first to write one!
        </div>

        <div *ngFor="let review of reviews" class="review-item">
          <div *ngIf="editingReview?.id !== review.id" class="review-content">
            <div class="review-header">
              <div class="review-user">
                <span class="username">{{ review.user?.username || 'Anonymous' }}</span>

                <div class="review-rating">
                  <span class="rating-badge">{{ review.rating }}/10</span>
                </div>
              </div>

              <span class="review-date">{{ formatDate(review.created_at) }}</span>
            </div>

            <h4 class="review-title">{{ review.title }}</h4>
            <p class="review-text">{{ review.text }}</p>

            <div class="review-actions" *ngIf="canEditReview(review)">
              <button (click)="startEdit(review)" class="btn-edit">Edit</button>
              <button (click)="deleteReview(review.id)" class="btn-delete">Delete</button>
            </div>
          </div>

          <div *ngIf="editingReview?.id === review.id" class="review-edit">
            <div class="form-group">
              <label>Rating (1-10):</label>
              <input
                type="number"
                [(ngModel)]="editData.rating"
                min="1"
                max="10"
              />
            </div>

            <div class="form-group">
              <label>Title:</label>
              <input
                type="text"
                [(ngModel)]="editData.title"
                maxlength="200"
              />
            </div>

            <div class="form-group">
              <textarea
                [(ngModel)]="editData.text"
                rows="4"
                maxlength="5000"
              ></textarea>
            </div>

            <div class="form-actions">
              <button (click)="saveEdit()" [disabled]="!canSaveEdit()" class="btn-submit">
                Save
              </button>
              <button (click)="cancelEdit()" class="btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reviews-container {
      margin-top: 30px;
      color: white;
    }

    .reviews-title {
      font-size: 24px;
      margin-bottom: 20px;
    }

    .loading-state, .error-state, .login-prompt, .no-reviews {
      padding: 20px;
      text-align: center;
      color: #b3b3b3;
    }

    .btn-retry, .btn-add-review, .btn-submit, .btn-cancel {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin: 5px;
    }

    .btn-add-review, .btn-submit {
      background: #e50914;
      color: white;
    }

    .btn-cancel, .btn-retry {
      background: #333;
      color: white;
    }

    .review-form, .review-item {
      background: #1f1f1f;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 15px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      color: #e5e5e5;
    }

    input, textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #444;
      border-radius: 4px;
      background: #2a2a2a;
      color: white;
      box-sizing: border-box;
    }

    .char-count, .rating-value {
      font-size: 12px;
      color: #888;
      display: block;
      margin-top: 5px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
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

    .review-title {
      margin: 8px 0;
      color: #fff;
    }

    .rating-badge {
      color: #ffd700;
      font-weight: 600;
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
    rating: 1,
    title: '',
    text: ''
  };

  editingReview: Review | null = null;
  editData: { rating: number; title: string; text: string } = {
    rating: 1,
    title: '',
    text: ''
  };

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();

    const authSub = this.authService.isAuthenticated$.subscribe(auth => {
      this.isAuthenticated = auth;
      if (auth) {
        this.loadCurrentUser();
      }
    });

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

  canSubmitReview(): boolean {
    return !!(
      this.newReview.title.trim() &&
      this.newReview.text.trim() &&
      this.newReview.rating >= 1 &&
      this.newReview.rating <= 10
    );
  }

  submitReview(): void {
    if (!this.canSubmitReview()) return;

    const reviewData = {
      rating: this.newReview.rating,
      title: this.newReview.title.trim(),
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
    this.newReview = { rating: 1, title: '', text: '' };
  }

  startEdit(review: Review): void {
    this.editingReview = review;
    this.editData = {
      rating: review.rating,
      title: review.title,
      text: review.text
    };
  }

  saveEdit(): void {
    if (!this.editingReview || !this.canSaveEdit()) return;

    this.reviewService.updateReview(this.movieId, this.editingReview.id, {
      rating: this.editData.rating,
      title: this.editData.title.trim(),
      text: this.editData.text.trim()
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
    this.editData = { rating: 1, title: '', text: '' };
  }

  canSaveEdit(): boolean {
    return !!(
      this.editData.title.trim() &&
      this.editData.text.trim() &&
      this.editData.rating >= 1 &&
      this.editData.rating <= 10
    );
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

  canEditReview(review: Review): boolean {
    if (!this.isAuthenticated || !this.currentUserId) return false;
    return review.user?.id === this.currentUserId;
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