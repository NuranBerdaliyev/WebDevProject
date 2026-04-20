import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { inject } from '@angular/core';
import { NotificationService } from './notification.service';



interface RatingMap {
  [movieId: number]: number;
}



@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private readonly storageKey = 'movie_ratings';

  private readonly ratingsSubject = new BehaviorSubject<RatingMap>(
    this.getStoredRatings()
  );

  readonly ratings$ = this.ratingsSubject.asObservable();

  setRating(movieId: number, rating: number): void {
    if (rating < 1 || rating > 5) {
      return;
    }
  
    const current = this.ratingsSubject.value;
  
    const updated = {
      ...current,
      [movieId]: rating
    };
  
    this.ratingsSubject.next(updated);
    this.saveRatings(updated);
  }

  getRating(movieId: number): number | null {
    return this.ratingsSubject.value[movieId] ?? null;
  }

  removeRating(movieId: number): void {
    const current = { ...this.ratingsSubject.value };

    delete current[movieId];

    this.ratingsSubject.next(current);
    this.saveRatings(current);
  }

  getAllRatings(): RatingMap {
    return this.ratingsSubject.value;
  }

  clearRatings(): void {
    this.ratingsSubject.next({});
    localStorage.removeItem(this.storageKey);
  }

  private saveRatings(ratings: RatingMap): void {
    localStorage.setItem(this.storageKey, JSON.stringify(ratings));
  }

  private getStoredRatings(): RatingMap {
    const stored = localStorage.getItem(this.storageKey);

    if (!stored) {
      return {};
    }

    try {
      return JSON.parse(stored) as RatingMap;
    } catch {
      localStorage.removeItem(this.storageKey);
      return {};
    }
  }
}