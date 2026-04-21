import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-overlay" (click)="onClose()">
      <div class="login-container" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="onClose()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="login-header">
          <svg viewBox="0 0 111 30" class="logo" aria-hidden="true">
            <path fill="#e50914" d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.468 0h5.063l3.062 7.874L105.875 0h5.124l-5.937 14.28zM90.563 0L90 14.28 89.437 30h-5.376l.563-14.28L90.562 0h5.376zM81 0v30h-5.188V0H81zm-12.969 0v30h-5.188V0h5.188zm-12.937 0l.562 14.28.563 15.72h-5.376l-.562-15.72L60.125 0h5.376zm-12.906 0v5.156c-1.906 0-3.844.094-5.719.188V30h-5.188V5.594c-1.969.125-3.906.25-5.812.406V0h16.719zM24.188 0v30H19V18.375c-1.625.062-3.25.156-4.844.281V30H9.031V19.031c-2.687.25-5.312.562-7.906.937L0 15.125c2.281-.375 4.5-.687 6.75-1V5.687c-2.25.156-4.469.344-6.656.562L0 .625C2.438.25 4.906 0 7.375 0h5.5v9.156l4.844-.344V0h6.469zm48.094 5.656V30h-5.188V6.375l-5.031.344V.97c3.437-.375 6.906-.687 10.344-.97h5.062v5.656h-5.187z"/>
          </svg>
          <h2>Sign In</h2>
        </div>

        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="Email or phone number"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="Password"
              required
              class="form-input"
            />
          </div>

          <button type="submit" class="submit-btn">Sign In</button>

          <div class="form-options">
            <label class="remember">
              <input type="checkbox" [(ngModel)]="rememberMe" name="remember" />
              <span>Remember me</span>
            </label>
            <a href="#" class="help-link">Need help?</a>
          </div>
        </form>

        <div class="login-footer">
          <p>New to Netflix? <a (click)="onSignUp()">Sign up now</a>.</p>
          <p class="recaptcha">This page is protected by Google reCAPTCHA.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(5px);
    }

    .login-container {
      background: rgba(0, 0, 0, 0.9);
      padding: 40px 60px;
      border-radius: 8px;
      width: 100%;
      max-width: 450px;
      position: relative;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .close-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      background: none;
      border: none;
      color: #737373;
      cursor: pointer;
      padding: 5px;
    }

    .close-btn:hover {
      color: white;
    }

    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .logo {
      width: 120px;
      margin-bottom: 20px;
    }

    .login-header h2 {
      font-size: 28px;
      font-weight: 600;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group {
      width: 100%;
    }

    .form-input {
      width: 100%;
      padding: 16px;
      background: #333;
      border: none;
      border-radius: 4px;
      color: white;
      font-size: 16px;
      box-sizing: border-box;
    }

    .form-input::placeholder {
      color: #8c8c8c;
    }

    .form-input:focus {
      outline: none;
      background: #454545;
    }

    .submit-btn {
      width: 100%;
      padding: 16px;
      background: #e50914;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 10px;
    }

    .submit-btn:hover {
      background: #f40612;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: #b3b3b3;
    }

    .remember {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
    }

    .remember input {
      accent-color: #737373;
    }

    .help-link {
      color: #b3b3b3;
      text-decoration: none;
    }

    .help-link:hover {
      text-decoration: underline;
    }

    .login-footer {
      margin-top: 30px;
      text-align: center;
      color: #737373;
    }

    .login-footer a {
      color: white;
      text-decoration: none;
      cursor: pointer;
    }

    .login-footer a:hover {
      text-decoration: underline;
    }

    .recaptcha {
      font-size: 12px;
      margin-top: 15px;
    }

    @media (max-width: 500px) {
      .login-container {
        padding: 30px 20px;
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;

  @Output() login = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onSubmit(): void {
    if (this.email && this.password) {
      this.login.emit();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSignUp(): void {
    // Handle sign up
  }
}
