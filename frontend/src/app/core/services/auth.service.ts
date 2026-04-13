import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, finalize } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly errorHandler = inject(ErrorHandlerService);

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'access_token';

  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    this.loadingSubject.next(true);

    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, credentials).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.access);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError((error) => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
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
}