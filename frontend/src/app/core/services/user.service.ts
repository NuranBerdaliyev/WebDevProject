import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

// Модель пользователя Django
export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly apiUrl = environment.apiUrl;

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  // Текущий пользователь
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  /**
   * Получить информацию о текущем пользователе
   * Django REST Framework endpoint: /api/auth/user/ или /api/users/me/
   * Если такого нет, используем декодирование JWT токена
   */
  getCurrentUser(): Observable<User> {
    this.loadingSubject.next(true);

    const cachedUser = localStorage.getItem('current_user');
    if (cachedUser) {
      const user = JSON.parse(cachedUser) as User;
      this.currentUserSubject.next(user);
    }

    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user: User = {
          id: payload.user_id || 0,
          username: payload.username || 'Unknown'
        };

        this.currentUserSubject.next(user);
        localStorage.setItem('current_user', JSON.stringify(user));
        this.loadingSubject.next(false);

        return of(user);
      } catch {
        // token parse failed
      }
    }

    this.loadingSubject.next(false);
    return throwError(() => new Error('User not authenticated'));
  }

  /**
   * Получить текущего пользователя из кэша
   */
  getCachedUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  /**
   * Очистить данные пользователя (при logout)
   */
  clearUser(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('current_user');
  }

  /**
   * Регистрация нового пользователя
   * Django по умолчанию не предоставляет endpoint регистрации
   * Нужно добавить в backend или использовать кастомный
   */
  register(userData: { username: string; password: string; email?: string }): Observable<User> {
    this.loadingSubject.next(true);
    void userData;
    this.loadingSubject.next(false);

    return throwError(
      () => new Error('Registration endpoint not implemented in backend. Please use Django admin to create users.')
    );
  }
}
