import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, of } from 'rxjs';

interface UserProfile {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar_url?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-overlay" (click)="onClose()">
      <div class="profile-container" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="onClose()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="profile-header">
          <div class="avatar-section">
            <div class="avatar">
              <span>{{ getInitials() }}</span>
            </div>
            <h2>{{ user?.username || 'User' }}</h2>
            <p class="member-since">Member since {{ memberSince }}</p>
          </div>
        </div>

        <div class="profile-tabs">
          <button
            class="tab-btn"
            [class.active]="activeTab === 'profile'"
            (click)="activeTab = 'profile'"
          >
            Profile
          </button>
          <button
            class="tab-btn"
            [class.active]="activeTab === 'password'"
            (click)="activeTab = 'password'"
          >
            Change Password
          </button>
          <button
            class="tab-btn"
            [class.active]="activeTab === 'activity'"
            (click)="activeTab = 'activity'"
          >
            Activity
          </button>
        </div>

        <!-- Profile Tab -->
        <div *ngIf="activeTab === 'profile'" class="tab-content">
          <form (ngSubmit)="saveProfile()" class="profile-form">
            <div class="form-group">
              <label>Username</label>
              <input
                type="text"
                [(ngModel)]="profileForm.username"
                name="username"
                disabled
                class="form-input disabled"
              >
              <small>Username cannot be changed</small>
            </div>

            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                [(ngModel)]="profileForm.email"
                name="email"
                class="form-input"
                placeholder="Enter your email"
              >
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  [(ngModel)]="profileForm.first_name"
                  name="first_name"
                  class="form-input"
                  placeholder="First name"
                >
              </div>

              <div class="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  [(ngModel)]="profileForm.last_name"
                  name="last_name"
                  class="form-input"
                  placeholder="Last name"
                >
              </div>
            </div>

            <div class="form-group">
              <label>Bio</label>
              <textarea
                [(ngModel)]="profileForm.bio"
                name="bio"
                rows="3"
                class="form-input"
                placeholder="Tell us about yourself..."
                maxlength="500"
              ></textarea>
              <span class="char-count">{{ profileForm.bio?.length || 0 }}/500</span>
            </div>

            <div *ngIf="successMessage" class="success-message">
              {{ successMessage }}
            </div>

            <div *ngIf="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              class="submit-btn"
              [disabled]="saving"
            >
              <span *ngIf="!saving">Save Changes</span>
              <span *ngIf="saving" class="btn-spinner"></span>
            </button>
          </form>
        </div>

        <!-- Password Tab -->
        <div *ngIf="activeTab === 'password'" class="tab-content">
          <form (ngSubmit)="changePassword()" class="profile-form">
            <div class="form-group">
              <label>Current Password</label>
              <input
                type="password"
                [(ngModel)]="passwordForm.oldPassword"
                name="old_password"
                class="form-input"
                required
              >
            </div>

            <div class="form-group">
              <label>New Password</label>
              <input
                type="password"
                [(ngModel)]="passwordForm.newPassword"
                name="new_password"
                class="form-input"
                required
                minlength="8"
              >
              <small *ngIf="passwordForm.newPassword && passwordForm.newPassword.length < 8">
                Password must be at least 8 characters
              </small>
            </div>

            <div class="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                [(ngModel)]="passwordForm.confirmPassword"
                name="confirm_password"
                class="form-input"
                required
              >
              <small *ngIf="passwordMismatch" class="error-text">
                Passwords do not match
              </small>
            </div>

            <div *ngIf="passwordSuccess" class="success-message">
              {{ passwordSuccess }}
            </div>

            <div *ngIf="passwordError" class="error-message">
              {{ passwordError }}
            </div>

            <button
              type="submit"
              class="submit-btn"
              [disabled]="changingPassword || !canChangePassword()"
            >
              <span *ngIf="!changingPassword">Change Password</span>
              <span *ngIf="changingPassword" class="btn-spinner"></span>
            </button>
          </form>
        </div>

        <!-- Activity Tab -->
        <div *ngIf="activeTab === 'activity'" class="tab-content">
          <div class="activity-stats">
            <div class="stat-card">
              <span class="stat-value">{{ activityStats.moviesWatched }}</span>
              <span class="stat-label">Movies Watched</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ activityStats.hoursWatched }}h</span>
              <span class="stat-label">Hours Watched</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ activityStats.reviewsWritten }}</span>
              <span class="stat-label">Reviews</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ activityStats.favorites }}</span>
              <span class="stat-label">Favorites</span>
            </div>
          </div>

          <div class="activity-section">
            <h4>Recent Activity</h4>
            <div class="activity-list">
              <div *ngFor="let activity of recentActivity" class="activity-item">
                <span class="activity-action">{{ activity.action }}</span>
                <span class="activity-movie">{{ activity.movie }}</span>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
              <div *ngIf="recentActivity.length === 0" class="no-activity">
                No recent activity
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
      z-index: 3000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow-y: auto;
    }

    .profile-container {
      background: #181818;
      border-radius: 8px;
      width: 100%;
      max-width: 600px;
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
      z-index: 10;
    }

    .close-btn:hover {
      color: white;
    }

    .profile-header {
      padding: 40px;
      text-align: center;
      border-bottom: 1px solid #333;
    }

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e50914, #b9090b);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: 700;
      color: white;
    }

    .profile-header h2 {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }

    .member-since {
      color: #737373;
      font-size: 14px;
      margin: 0;
    }

    .profile-tabs {
      display: flex;
      border-bottom: 1px solid #333;
    }

    .tab-btn {
      flex: 1;
      padding: 15px;
      background: transparent;
      border: none;
      color: #737373;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border-bottom: 3px solid transparent;
    }

    .tab-btn:hover {
      color: white;
    }

    .tab-btn.active {
      color: white;
      border-bottom-color: #e50914;
    }

    .tab-content {
      padding: 30px;
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-size: 14px;
      font-weight: 600;
      color: #e5e5e5;
    }

    .form-input {
      padding: 12px 16px;
      background: #333;
      border: 1px solid transparent;
      border-radius: 4px;
      color: white;
      font-size: 14px;
      transition: all 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #e50914;
    }

    .form-input.disabled {
      background: #262626;
      color: #737373;
      cursor: not-allowed;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    small {
      color: #737373;
      font-size: 12px;
    }

    .error-text {
      color: #e87c03;
    }

    .char-count {
      text-align: right;
      color: #737373;
      font-size: 12px;
    }

    .success-message {
      background: rgba(70, 211, 105, 0.1);
      color: #46d369;
      padding: 12px;
      border-radius: 4px;
      font-size: 14px;
    }

    .error-message {
      background: rgba(232, 124, 3, 0.1);
      color: #e87c03;
      padding: 12px;
      border-radius: 4px;
      font-size: 14px;
    }

    .submit-btn {
      padding: 14px;
      background: #e50914;
      border: none;
      border-radius: 4px;
      color: white;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 10px;
    }

    .submit-btn:hover:not(:disabled) {
      background: #f40612;
    }

    .submit-btn:disabled {
      background: #666;
      cursor: not-allowed;
    }

    .btn-spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid #fff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Activity Tab */
    .activity-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: #262626;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #e50914;
    }

    .stat-label {
      font-size: 13px;
      color: #a3a3a3;
    }

    .activity-section h4 {
      margin-bottom: 15px;
      color: #e5e5e5;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      background: #262626;
      border-radius: 4px;
      font-size: 14px;
    }

    .activity-action {
      color: #a3a3a3;
    }

    .activity-movie {
      flex: 1;
      color: white;
      font-weight: 500;
    }

    .activity-time {
      color: #737373;
      font-size: 12px;
    }

    .no-activity {
      text-align: center;
      padding: 30px;
      color: #737373;
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .activity-stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .profile-header {
        padding: 30px 20px;
      }

      .tab-content {
        padding: 20px;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  @Input() user: UserProfile | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() profileUpdated = new EventEmitter<UserProfile>();

  private authService = inject(AuthService);
  private http = inject(HttpClient);

  activeTab: 'profile' | 'password' | 'activity' = 'profile';
  memberSince = 'April 2025';

  profileForm: Partial<UserProfile> = {};
  passwordForm = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  saving = false;
  changingPassword = false;
  successMessage = '';
  errorMessage = '';
  passwordSuccess = '';
  passwordError = '';

  activityStats = {
    moviesWatched: 12,
    hoursWatched: 24,
    reviewsWritten: 3,
    favorites: 8
  };

  recentActivity: { action: string; movie: string; time: string }[] = [
    { action: 'Watched', movie: 'Inception', time: '2 hours ago' },
    { action: 'Added to favorites', movie: 'The Dark Knight', time: '1 day ago' },
    { action: 'Reviewed', movie: 'Interstellar', time: '3 days ago' }
  ];

  ngOnInit(): void {
    if (this.user) {
      this.profileForm = { ...this.user };
    }
  }

  getInitials(): string {
    const first = this.profileForm.first_name?.[0] || '';
    const last = this.profileForm.last_name?.[0] || '';
    if (first || last) {
      return (first + last).toUpperCase();
    }
    return this.user?.username?.[0]?.toUpperCase() || 'U';
  }

  saveProfile(): void {
    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    // TODO: Implement backend endpoint for profile update
    setTimeout(() => {
      this.saving = false;
      this.successMessage = 'Profile updated successfully!';
      this.profileUpdated.emit(this.profileForm as UserProfile);
    }, 1000);
  }

  changePassword(): void {
    if (!this.canChangePassword()) return;

    this.changingPassword = true;
    this.passwordSuccess = '';
    this.passwordError = '';

    // TODO: Implement backend endpoint for password change
    setTimeout(() => {
      this.changingPassword = false;
      this.passwordSuccess = 'Password changed successfully!';
      this.passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
    }, 1000);
  }

  canChangePassword(): boolean {
    return !!(
      this.passwordForm.oldPassword &&
      this.passwordForm.newPassword?.length >= 8 &&
      this.passwordForm.confirmPassword &&
      !this.passwordMismatch
    );
  }

  get passwordMismatch(): boolean {
    return (
      this.passwordForm.confirmPassword !== '' &&
      this.passwordForm.newPassword !== this.passwordForm.confirmPassword
    );
  }

  onClose(): void {
    this.close.emit();
  }
}
