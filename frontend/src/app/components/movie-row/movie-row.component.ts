import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../services/movie.service';

@Component({
  selector: 'app-movie-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="movie-row">
      <h2 class="row-title">{{ title }}</h2>
      <div class="row-slider">
        <button class="slider-btn prev" (click)="scroll('left')" *ngIf="showArrows">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div class="row-posters" #slider>
          <div
            class="movie-card"
            *ngFor="let movie of movies"
            (click)="onMovieClick(movie)"
            (mouseenter)="onHover(movie)"
            (mouseleave)="onLeave()"
          >
            <img [src]="movie.image" [alt]="movie.title" class="poster-image" />

            <div class="card-overlay" *ngIf="hoveredMovie?.id === movie.id">
              <img [src]="movie.image" [alt]="movie.title" class="overlay-image" />
              <div class="overlay-content">
                <h3>{{ movie.title }}</h3>
                <div class="overlay-meta">
                  <span class="rating">{{ movie.rating.toFixed(1) }}</span>
                  <span>{{ movie.duration }}</span>
                  <span class="quality">HD</span>
                </div>
                <div class="overlay-genres">
                  <span *ngFor="let genre of movie.genre.slice(0, 3)">{{ genre }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="slider-btn next" (click)="scroll('right')" *ngIf="showArrows">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .movie-row {
      margin-bottom: 3vw;
      padding-left: 4%;
    }

    .row-title {
      font-size: 1.4vw;
      font-weight: 700;
      margin-bottom: 1vw;
      color: #e5e5e5;
      line-height: 1.25;
    }

    .row-slider {
      position: relative;
      display: flex;
      align-items: center;
    }

    .row-posters {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-behavior: smooth;
      scrollbar-width: none;
      padding: 20px 0;
    }

    .row-posters::-webkit-scrollbar {
      display: none;
    }

    .movie-card {
      flex: 0 0 auto;
      width: 16%;
      min-width: 200px;
      cursor: pointer;
      transition: transform 0.3s ease;
      position: relative;
    }

    .movie-card:hover {
      transform: scale(1.05);
      z-index: 10;
    }

    .poster-image {
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
      border-radius: 4px;
    }

    .card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 300px;
      background: #181818;
      border-radius: 8px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      z-index: 100;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .overlay-image {
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
      border-radius: 8px 8px 0 0;
    }

    .overlay-content {
      padding: 15px;
      color: white;
    }

    .overlay-content h3 {
      font-size: 16px;
      margin-bottom: 8px;
    }

    .overlay-meta {
      display: flex;
      gap: 10px;
      margin-bottom: 8px;
      font-size: 13px;
      color: #a3a3a3;
    }

    .overlay-meta .rating {
      color: #46d369;
      font-weight: 600;
    }

    .overlay-meta .quality {
      border: 1px solid rgba(255,255,255,0.4);
      padding: 0 4px;
      font-size: 11px;
    }

    .overlay-genres {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .overlay-genres span {
      background: rgba(255,255,255,0.1);
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 11px;
    }

    .slider-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0,0,0,0.5);
      border: none;
      color: white;
      width: 50px;
      height: 100%;
      cursor: pointer;
      z-index: 10;
      opacity: 0;
      transition: opacity 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .row-slider:hover .slider-btn {
      opacity: 1;
    }

    .slider-btn:hover {
      background: rgba(0,0,0,0.7);
    }

    .slider-btn.prev {
      left: 0;
    }

    .slider-btn.next {
      right: 0;
    }

    @media (max-width: 1200px) {
      .movie-card {
        width: 20%;
      }
    }

    @media (max-width: 885px) {
      .movie-card {
        width: 33%;
      }

      .row-title {
        font-size: 2.5vw;
      }
    }
  `]
})
export class MovieRowComponent {
  @Input() title = '';
  @Input() movies: Movie[] = [];
  @Input() showArrows = true;

  @Output() movieClick = new EventEmitter<Movie>();

  hoveredMovie: Movie | null = null;

  scroll(direction: 'left' | 'right'): void {
    // Will be implemented with ViewChild if needed
  }

  onHover(movie: Movie): void {
    this.hoveredMovie = movie;
  }

  onLeave(): void {
    this.hoveredMovie = null;
  }

  onMovieClick(movie: Movie): void {
    this.movieClick.emit(movie);
  }
}
