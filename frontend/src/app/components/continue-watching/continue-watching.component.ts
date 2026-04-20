import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewingProgressService, ViewingProgress } from '../../core/services/viewing-progress.service';

@Component({
  selector: 'app-continue-watching',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="continue-watching" *ngIf="items.length > 0">
      <div class="section-header">
        <h2 class="section-title">Continue Watching</h2>
      </div>

      <div class="progress-grid">
        <div
          *ngFor="let item of items"
          class="progress-card"
          (click)="onItemClick(item)"
        >
          <div class="thumbnail-container">
            <img
              [src]="item.backdrop_url || item.poster_url"
              [alt]="item.title"
              class="thumbnail"
            >
            <div class="play-overlay">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>

            <button
              class="remove-btn"
              (click)="onRemoveClick($event, item.movie_id)"
              title="Remove from history"
            >
              ×
            </button>
          </div>

          <div class="progress-info">
            <h3 class="movie-title">{{ item.title }}</h3>
            <div class="progress-bar-container">
              <div
                class="progress-bar"
                [style.width.%]="viewingProgressService.getProgressBarWidth(item.progress_seconds, item.duration_seconds)"
              ></div>
            </div>
            <p class="time-remaining">
              {{ viewingProgressService.formatRemainingTime(item.progress_seconds, item.duration_seconds) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .continue-watching {
      margin-bottom: 3vw;
      padding: 0 4%;
    }

    .section-header {
      margin-bottom: 1vw;
    }

    .section-title {
      font-size: 1.4vw;
      font-weight: 700;
      color: #e5e5e5;
      line-height: 1.25;
    }

    .progress-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .progress-card {
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .progress-card:hover {
      transform: scale(1.02);
    }

    .thumbnail-container {
      position: relative;
      border-radius: 4px;
      overflow: hidden;
      aspect-ratio: 16/9;
    }

    .thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .play-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .progress-card:hover .play-overlay {
      opacity: 1;
    }

    .play-overlay svg {
      color: white;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
    }

    .remove-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 4px;
    }

    .progress-card:hover .remove-btn {
      opacity: 1;
    }

    .remove-btn:hover {
      background: #e50914;
      border-color: #e50914;
    }

    .progress-info {
      padding: 12px 0;
    }

    .movie-title {
      font-size: 14px;
      font-weight: 600;
      color: #e5e5e5;
      margin: 0 0 8px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .progress-bar-container {
      height: 4px;
      background: #333;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .progress-bar {
      height: 100%;
      background: #e50914;
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    .time-remaining {
      font-size: 12px;
      color: #a3a3a3;
      margin: 0;
    }

    @media (max-width: 768px) {
      .progress-grid {
        grid-template-columns: 1fr;
      }

      .section-title {
        font-size: 18px;
      }
    }
  `]
})
export class ContinueWatchingComponent {
  @Input() items: ViewingProgress[] = [];

  @Output() itemClick = new EventEmitter<ViewingProgress>();
  @Output() removeItem = new EventEmitter<number>();

  viewingProgressService = inject(ViewingProgressService);

  onItemClick(item: ViewingProgress): void {
    this.itemClick.emit(item);
  }

  onRemoveClick(event: Event, movieId: number): void {
    event.stopPropagation();
    this.removeItem.emit(movieId);
  }
}
