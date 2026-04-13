import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { MovieRowComponent } from './components/movie-row/movie-row.component';
import { MovieModalComponent } from './components/movie-modal/movie-modal.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { Movie, MovieService } from './services/movie.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    MovieRowComponent,
    MovieModalComponent,
    VideoPlayerComponent,
    LoginComponent,
    FooterComponent
  ],
  template: `
    <div class="app-container">
      <app-header
        [isSearchOpen]="isSearchOpen"
        [isLoggedIn]="isLoggedIn"
        [isScrolled]="isScrolled"
        [searchQuery]="searchQuery"
        (searchToggle)="toggleSearch()"
        (searchChange)="onSearchChange($event)"
        (logout)="logout()"
        (loginClick)="showLogin = true"
        (navClick)="onNavClick($event)"
      ></app-header>

      <main class="main-content">
        <ng-container *ngIf="searchResults.length > 0; else defaultView">
          <app-movie-row
            [title]="'Search Results'"
            [movies]="searchResults"
            (movieClick)="openMovie($event)"
          ></app-movie-row>
        </ng-container>

        <ng-template #defaultView>
          <app-hero
            [movie]="featuredMovie"
            (play)="playMovie($event)"
            (moreInfo)="openMovie($event)"
          ></app-hero>

          <div class="movie-rows">
            <app-movie-row
              [title]="'Trending Now'"
              [movies]="trendingMovies"
              (movieClick)="openMovie($event)"
            ></app-movie-row>

            <app-movie-row
              [title]="'Popular on Netflix'"
              [movies]="popularMovies"
              (movieClick)="openMovie($event)"
            ></app-movie-row>

            <app-movie-row
              [title]="'Top Rated'"
              [movies]="topRatedMovies"
              (movieClick)="openMovie($event)"
            ></app-movie-row>
          </div>
        </ng-template>
      </main>

      <app-footer></app-footer>

      <app-movie-modal
        *ngIf="selectedMovie"
        [movie]="selectedMovie"
        [isFavorite]="isFavorite(selectedMovie.id)"
        (close)="closeModal()"
        (toggleFavorite)="toggleFavorite(selectedMovie.id)"
        (play)="playMovie(selectedMovie)"
      ></app-movie-modal>

      <app-video-player
        *ngIf="currentVideo"
        [isOpen]="!!currentVideo"
        [videoUrl]="currentVideo || ''"
        [title]="selectedMovie?.title || ''"
        (close)="closeVideo()"
      ></app-video-player>

      <app-login
        *ngIf="showLogin"
        (login)="login()"
        (close)="showLogin = false"
      ></app-login>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #141414;
    }

    .main-content {
      padding-top: 68px;
    }

    .movie-rows {
      margin-top: -150px;
      position: relative;
      z-index: 10;
      background: linear-gradient(to bottom, transparent 0%, #141414 100px);
    }

    app-hero {
      display: block;
      margin-bottom: -100px;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  isSearchOpen = false;
  isLoggedIn = false;
  isScrolled = false;
  showLogin = false;

  searchQuery = '';
  searchResults: Movie[] = [];

  featuredMovie: Movie | null = null;
  trendingMovies: Movie[] = [];
  popularMovies: Movie[] = [];
  topRatedMovies: Movie[] = [];

  selectedMovie: Movie | null = null;
  currentVideo: string | null = null;

  private searchSubject = new Subject<string>();
  private subscriptions: Subscription[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    // Setup search with debounce
    const searchSub = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.trim()) {
        this.movieService.searchMovies(query).subscribe(results => {
          this.searchResults = results;
        });
      } else {
        this.searchResults = [];
      }
    });
    this.subscriptions.push(searchSub);

    // Load movies
    this.loadMovies();

    // Load favorites from localStorage
    const favorites = localStorage.getItem('netflix_favorites');
    if (favorites) {
      const ids = JSON.parse(favorites);
      ids.forEach((id: number) => this.movieService.addToFavorites(id));
    }

    // Check login status
    const loggedIn = localStorage.getItem('netflix_logged_in');
    this.isLoggedIn = loggedIn === 'true';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  loadMovies(): void {
    this.movieService.getTrending().subscribe(movies => {
      this.trendingMovies = movies;
      this.featuredMovie = movies[0];
    });

    this.movieService.getPopular().subscribe(movies => {
      this.popularMovies = movies;
    });

    this.movieService.getTopRated().subscribe(movies => {
      this.topRatedMovies = movies;
    });
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
    if (!this.isSearchOpen) {
      this.searchQuery = '';
      this.searchResults = [];
    }
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  openMovie(movie: Movie): void {
    this.selectedMovie = movie;
  }

  closeModal(): void {
    this.selectedMovie = null;
  }

  playMovie(movie: Movie): void {
    if (movie.videoUrl) {
      this.currentVideo = movie.videoUrl;
      this.selectedMovie = movie;
    } else {
      alert('Video not available for this movie');
    }
  }

  closeVideo(): void {
    this.currentVideo = null;
  }

  toggleFavorite(movieId: number): void {
    if (this.movieService.isFavorite(movieId)) {
      this.movieService.removeFromFavorites(movieId);
    } else {
      this.movieService.addToFavorites(movieId);
    }
    this.saveFavorites();
  }

  isFavorite(movieId: number): boolean {
    return this.movieService.isFavorite(movieId);
  }

  private saveFavorites(): void {
    this.movieService.favorites$.subscribe(favorites => {
      localStorage.setItem('netflix_favorites', JSON.stringify(favorites));
    }).unsubscribe();
  }

  login(): void {
    this.isLoggedIn = true;
    this.showLogin = false;
    localStorage.setItem('netflix_logged_in', 'true');
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('netflix_logged_in');
  }

  onNavClick(section: string): void {
    console.log('Navigating to:', section);
    // Implement navigation logic
  }
}
