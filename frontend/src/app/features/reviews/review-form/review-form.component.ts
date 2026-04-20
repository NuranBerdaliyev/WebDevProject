import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ReviewService } from '../../../core/services/review.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css'
})
export class ReviewFormComponent {
  private readonly fb = inject(FormBuilder);
  readonly reviewService = inject(ReviewService);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);

  errorMessage = '';

  readonly reviewForm = this.fb.group({
    rating: [null as number | null, [Validators.required, Validators.min(1), Validators.max(10)]],
    title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
    text: ['', [Validators.maxLength(5000)]]
  });

  onSubmit(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const movieId = Number(this.route.snapshot.paramMap.get('movieId'));

    if (!movieId) {
      this.errorMessage = 'Movie ID is missing.';
      return;
    }

    const reviewData = {
      rating: this.reviewForm.value.rating ?? 1,
      title: this.reviewForm.value.title ?? '',
      text: this.reviewForm.value.text ?? ''
    };

    this.reviewService.createReview(movieId, reviewData).subscribe({
      next: () => {
        this.notificationService.success('Review submitted successfully');
        this.reviewForm.reset();
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.notificationService.error(error.message);
      }
    });
  }
}