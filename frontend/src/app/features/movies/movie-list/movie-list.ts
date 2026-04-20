import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovieService } from '../../../core/services/movie.service';
import { Movie } from '../../../core/models/movie.model';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-list.html',
})
export class MovieListComponent implements OnInit {

  private movieService = inject(MovieService);

  movies: Movie[] = [];
  loading = false;

  ngOnInit(): void {
    this.loading = true;

    this.movieService.getMovies().subscribe({
      next: (response) => {
        this.movies = response.results;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}