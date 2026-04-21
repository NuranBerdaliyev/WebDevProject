import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../services/movie.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero" *ngIf="movie" [style.background-image]="'url(' + (movie.backdrop || movie.image) + ')'">
      <div class="hero-vignette"></div>
      <div class="hero-content">
        <h1 class="hero-title">{{ movie.title }}</h1>
        <div class="hero-meta">
          <span class="rating">{{ movie.rating.toFixed(1) }} Rating</span>
          <span class="year">{{ movie.year }}</span>
          <span class="duration">{{ movie.duration }}</span>
          <span class="quality">HD</span>
        </div>
        <p class="hero-description">{{ movie.description }}</p>
        <div class="hero-buttons">
          <button class="btn btn-primary" (click)="onPlay()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Play
          </button>
          <button class="btn btn-secondary" (click)="onMoreInfo()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            More Info
          </button>
        </div>
        <div class="hero-genres">
          <span *ngFor="let genre of movie.genre.slice(0, 3); let last = last">
            {{ genre }}<span *ngIf="!last" class="separator">•</span>
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero {
      position: relative;
      height: 80vh;
      background-size: cover;
      background-position: center top;
      display: flex;
      align-items: center;
    }

    .hero-vignette {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, #141414 0%, transparent 50%),
                  linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 50%);
    }

    .hero-content {
      position: relative;
      z-index: 2;
      width: 36%;
      margin-left: 4%;
      color: white;
    }

    .hero-title {
      font-size: 3.5vw;
      font-weight: 700;
      margin-bottom: 1vw;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }

    .hero-meta {
      display: flex;
      gap: 15px;
      margin-bottom: 1vw;
      font-size: 1.1vw;
      color: #a3a3a3;
    }

    .rating {
      color: #46d369;
      font-weight: 600;
    }

    .quality {
      border: 1px solid rgba(255,255,255,0.4);
      padding: 0 5px;
      font-size: 0.9vw;
    }

    .hero-description {
      font-size: 1.2vw;
      line-height: 1.4;
      margin-bottom: 1.5vw;
      color: #d2d2d2;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5vw;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0.7rem 1.8rem;
      border: none;
      border-radius: 4px;
      font-size: 1.1vw;
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

    .hero-genres {
      font-size: 1vw;
      color: #d2d2d2;
    }

    .separator {
      margin: 0 8px;
      color: #666;
    }

    @media (max-width: 885px) {
      .hero-content {
        width: 80%;
      }

      .hero-title {
        font-size: 6vw;
      }

      .hero-description {
        font-size: 2vw;
      }

      .btn {
        font-size: 2vw;
      }
    }
  `]
})
export class HeroComponent {
  @Input() movie: Movie | null = null;

  @Output() play = new EventEmitter<Movie>();
  @Output() moreInfo = new EventEmitter<Movie>();

  onPlay(): void {
    if (this.movie) {
      this.play.emit(this.movie);
    }
  }

  onMoreInfo(): void {
    if (this.movie) {
      this.moreInfo.emit(this.movie);
    }
  }
}
