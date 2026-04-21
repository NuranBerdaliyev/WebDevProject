import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { MovieListComponent } from './movie-list';
import { MovieService } from '../../../core/services/movie.service';
import { WatchlistService } from '../../../core/services/watchlist.service';
import { NotificationService } from '../../../core/services/notification.service';

describe('MovieListComponent', () => {
  let component: MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;

  const movieServiceMock = {
    getMovies: () =>
      of({
        count: 0,
        next: null,
        previous: null,
        results: []
      })
  };

  const watchlistServiceMock = {
    addToWatchlist: () => of({ id: 1, movie_id: 1, added_at: new Date().toISOString() })
  };

  const notificationServiceMock = {
    success: (_msg: string) => {},
    error: (_msg: string) => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieListComponent],
      providers: [
        { provide: MovieService, useValue: movieServiceMock },
        { provide: WatchlistService, useValue: watchlistServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
