import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MovieService } from '../../../core/services/movie.service';
import { Movie } from '../../../core/models/movie.model';
import { NotificationService } from '../../../core/services/notification.service';
import { WatchlistService } from '../../../core/services/watchlist.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css'
})
export class MovieListComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly watchlistService = inject(WatchlistService);
  private readonly notificationService = inject(NotificationService);

  movies: Movie[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.errorMessage = '';

    this.movieService.getMovies().subscribe({
      next: (response) => {
        this.movies = response.results;
        this.loading = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }

  addToWatchlist(movieId: number): void {
    this.watchlistService.addToWatchlist(movieId).subscribe({
      next: () => {
        this.notificationService.success('Movie added to watchlist');
      },
      error: (error: Error) => {
        this.notificationService.error(error.message);
      }
    });
  }
}