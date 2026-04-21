import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private readonly userSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  readonly user$ = this.userSubject.asObservable();

  setUser(user: User | null): void {
    this.userSubject.next(user);

    if (user) {
      localStorage.setItem('current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('current_user');
    }
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  clearUser(): void {
    this.userSubject.next(null);
    localStorage.removeItem('current_user');
  }

  private getStoredUser(): User | null {
    const storedUser = localStorage.getItem('current_user');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      localStorage.removeItem('current_user');
      return null;
    }
  }
}