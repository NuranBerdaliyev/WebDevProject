import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenreService } from '../../core/services/genre.service';
import { Genre } from '../../core/models/genre.model';

@Component({
  selector: 'app-genre-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="genre-filter">
      <!-- Loading State -->
      <div *ngIf="loading" class="loading-state">
        <span class="spinner"></span>
      </div>

      <!-- Genre Dropdown -->
      <div *ngIf="!loading" class="dropdown-container">
        <button class="dropdown-toggle" (click)="toggleDropdown()" [class.active]="isOpen">
          <span>{{ selectedGenre ? selectedGenre.name : 'Filter by Genre' }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [class.rotated]="isOpen">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        <div *ngIf="isOpen" class="dropdown-menu">
          <div class="dropdown-item all" (click)="selectGenre(null)">
            All Genres
          </div>
          <div
            *ngFor="let genre of genres"
            class="dropdown-item"
            [class.selected]="selectedGenre?.id === genre.id"
            (click)="selectGenre(genre)"
          >
            {{ genre.name }}
          </div>
        </div>
      </div>

      <!-- Selected Genre Tag -->
      <div *ngIf="selectedGenre" class="selected-tag">
        <span>{{ selectedGenre.name }}</span>
        <button (click)="clearFilter()" class="clear-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .genre-filter {
      display: flex;
      align-items: center;
      gap: 10px;
      position: relative;
    }

    /* Loading State */
    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 36px;
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

    /* Dropdown Container */
    .dropdown-container {
      position: relative;
    }

    .dropdown-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      color: white;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 140px;
      justify-content: space-between;
    }

    .dropdown-toggle:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .dropdown-toggle.active {
      background: rgba(255, 255, 255, 0.15);
      border-color: white;
    }

    .dropdown-toggle svg {
      transition: transform 0.2s;
    }

    .dropdown-toggle svg.rotated {
      transform: rotate(180deg);
    }

    /* Dropdown Menu */
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 5px);
      left: 0;
      background: #181818;
      border: 1px solid #333;
      border-radius: 4px;
      min-width: 180px;
      max-height: 300px;
      overflow-y: auto;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown-item {
      padding: 12px 16px;
      color: #e5e5e5;
      cursor: pointer;
      transition: background 0.2s;
      border-bottom: 1px solid #262626;
    }

    .dropdown-item:last-child {
      border-bottom: none;
    }

    .dropdown-item:hover {
      background: #333;
    }

    .dropdown-item.selected {
      background: #e50914;
      color: white;
    }

    .dropdown-item.all {
      font-weight: 600;
      color: #a3a3a3;
    }

    /* Selected Tag */
    .selected-tag {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #e50914;
      border-radius: 4px;
      color: white;
      font-size: 14px;
    }

    .clear-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      border-radius: 50%;
      transition: background 0.2s;
    }

    .clear-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `]
})
export class GenreFilterComponent implements OnInit {
  @Input() selectedGenre: Genre | null = null;
  @Output() genreChange = new EventEmitter<Genre | null>();

  private genreService = inject(GenreService);

  genres: Genre[] = [];
  loading = false;
  error: string | null = null;
  isOpen = false;

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres(): void {
    this.loading = true;
    this.error = null;

    this.genreService.getGenres().subscribe({
      next: (genres) => {
        this.genres = genres;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load genres';
        this.loading = false;
      }
    });
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectGenre(genre: Genre | null): void {
    this.selectedGenre = genre;
    this.isOpen = false;
    this.genreChange.emit(genre);
  }

  clearFilter(): void {
    this.selectGenre(null);
  }

  // Close dropdown when clicking outside
  // This can be implemented with a HostListener if needed
}
