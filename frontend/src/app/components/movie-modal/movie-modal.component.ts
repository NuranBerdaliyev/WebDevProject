import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../services/movie.service';

@Component({
  selector: 'app-movie-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onClose()" *ngIf="movie">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="onClose()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="modal-hero" [style.background-image]="'url(' + (movie.backdrop || movie.image) + ')'">
          <div class="modal-vignette"></div>
          <div class="modal-hero-content">
            <h1>{{ movie.title }}</h1>
            <div class="modal-buttons">
              <button class="btn btn-primary" (click)="onPlay()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Play
              </button>
              <button class="btn btn-secondary" (click)="onToggleFavorite()">
                <svg width="24" height="24" viewBox="0 0 24 24" [attr.fill]="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {{ isFavorite ? 'Remove from List' : 'Add to List' }}
              </button>
            </div>
          </div>
        </div>

        <div class="modal-info">
          <div class="modal-main">
            <div class="meta-row">
              <span class="rating">{{ movie.rating.toFixed(1) }} Rating</span>
              <span>{{ movie.year }}</span>
              <span>{{ movie.duration }}</span>
              <span class="quality">HD</span>
            </div>
            <p class="description">{{ movie.description }}</p>
          </div>

          <div class="modal-meta">
            <div class="meta-item">
              <span class="meta-label">Cast:</span>
              <span>{{ movie.cast.join(', ') }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Genres:</span>
              <span>{{ movie.genre.join(', ') }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Director:</span>
              <span>{{ movie.director }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 2000;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 30px;
      overflow-y: auto;
    }

    .modal-content {
      background: #181818;
      border-radius: 8px;
      width: 90%;
      max-width: 850px;
      position: relative;
      animation: modalFadeIn 0.3s ease;
    }

    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .close-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      background: #181818;
      border: none;
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      background: #333;
    }

    .modal-hero {
      height: 400px;
      background-size: cover;
      background-position: center top;
      position: relative;
      border-radius: 8px 8px 0 0;
    }

    .modal-vignette {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, #181818 0%, transparent 60%);
    }

    .modal-hero-content {
      position: absolute;
      bottom: 30px;
      left: 40px;
      z-index: 2;
    }

    .modal-hero-content h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
    }

    .modal-buttons {
      display: flex;
      gap: 12px;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 24px;
      border: none;
      border-radius: 4px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: white;
      color: black;
    }

    .btn-primary:hover {
      background: rgba(255,255,255,0.75);
    }

    .btn-secondary {
      background: rgba(109,109,110,0.7);
      color: white;
    }

    .btn-secondary:hover {
      background: rgba(109,109,110,0.4);
    }

    .modal-info {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 40px;
      padding: 30px 40px;
    }

    .meta-row {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      font-size: 14px;
      color: #a3a3a3;
    }

    .meta-row .rating {
      color: #46d369;
      font-weight: 600;
    }

    .meta-row .quality {
      border: 1px solid rgba(255,255,255,0.4);
      padding: 0 5px;
      font-size: 12px;
    }

    .description {
      font-size: 16px;
      line-height: 1.5;
      color: #d2d2d2;
    }

    .modal-meta {
      font-size: 14px;
    }

    .meta-item {
      margin-bottom: 12px;
      color: #d2d2d2;
    }

    .meta-label {
      color: #a3a3a3;
      margin-right: 5px;
    }

    @media (max-width: 768px) {
      .modal-info {
        grid-template-columns: 1fr;
        padding: 20px;
      }

      .modal-hero-content {
        left: 20px;
        bottom: 20px;
      }

      .modal-hero-content h1 {
        font-size: 1.8rem;
      }
    }
  `]
})
export class MovieModalComponent {
  @Input() movie: Movie | null = null;
  @Input() isFavorite = false;

  @Output() close = new EventEmitter<void>();
  @Output() toggleFavorite = new EventEmitter<void>();
  @Output() play = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscKey(): void {
    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }

  onToggleFavorite(): void {
    this.toggleFavorite.emit();
  }

  onPlay(): void {
    this.play.emit();
  }
}
