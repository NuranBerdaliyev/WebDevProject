import { Injectable, inject } from '@angular/core';
<<<<<<< HEAD
import { BehaviorSubject, Observable, tap, catchError, finalize, map } from 'rxjs';
=======
import { BehaviorSubject, Observable, tap, catchError, finalize } from 'rxjs';
>>>>>>> origin
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { ErrorHandlerService } from './error-handler.service';
import { UserStateService } from './user-state.service';
<<<<<<< HEAD
import { User } from '../models/user.model';

type AuthApiResponse = {
  access: string;
  refresh: string;
  user?: User;
};
=======
>>>>>>> origin

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly userState = inject(UserStateService);

  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'access_token';

  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    this.loadingSubject.next(true);

    return this.http.post<AuthApiResponse>(`${this.apiUrl}/login/`, credentials).pipe(
      map((response) => {
        const user = response.user ?? this.buildUserFromToken(response.access);

        if (!user) {
          throw new Error('Unable to resolve user from login response');
        }

        return {
          access: response.access,
          refresh: response.refresh,
          user
        };
      }),
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.access);
        localStorage.setItem('refresh_token', response.refresh);
        this.isAuthenticatedSubject.next(true);
        this.userState.setUser(response.user);
      }),
      catchError((error) => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  logout(): void {
    const refresh = localStorage.getItem('refresh_token');

    if (refresh) {
      this.http.post(`${this.apiUrl}/logout/`, { refresh }).subscribe({
        next: () => undefined,
        error: () => undefined
      });
    }

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('refresh_token');
    this.isAuthenticatedSubject.next(false);
    this.userState.clearUser();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  register(data: { username: string; email: string; password: string }): Observable<unknown> {
    this.loadingSubject.next(true);
    return this.http.post(`${this.apiUrl}/register/`, data).pipe(
      catchError((error) => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  private buildUserFromToken(token: string): User | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.user_id ?? 0,
        username: payload.username ?? '',
        email: payload.email ?? '',
        first_name: payload.first_name ?? '',
        last_name: payload.last_name ?? ''
      };
    } catch {
      return null;
    }
  }
}