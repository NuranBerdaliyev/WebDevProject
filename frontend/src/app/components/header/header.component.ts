import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="header" [class.scrolled]="isScrolled">
      <div class="header-left">
        <div class="logo" (click)="onLogoClick()">
          <svg viewBox="0 0 111 30" class="logo-svg" aria-hidden="true">
            <path fill="#e50914" d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.468 0h5.063l3.062 7.874L105.875 0h5.124l-5.937 14.28zM90.563 0L90 14.28 89.437 30h-5.376l.563-14.28L90.562 0h5.376zM81 0v30h-5.188V0H81zm-12.969 0v30h-5.188V0h5.188zm-12.937 0l.562 14.28.563 15.72h-5.376l-.562-15.72L60.125 0h5.376zm-12.906 0v5.156c-1.906 0-3.844.094-5.719.188V30h-5.188V5.594c-1.969.125-3.906.25-5.812.406V0h16.719zM24.188 0v30H19V18.375c-1.625.062-3.25.156-4.844.281V30H9.031V19.031c-2.687.25-5.312.562-7.906.937L0 15.125c2.281-.375 4.5-.687 6.75-1V5.687c-2.25.156-4.469.344-6.656.562L0 .625C2.438.25 4.906 0 7.375 0h5.5v9.156l4.844-.344V0h6.469zm48.094 5.656V30h-5.188V6.375l-5.031.344V.97c3.437-.375 6.906-.687 10.344-.97h5.062v5.656h-5.187z"/>
          </svg>
        </div>
        <nav class="nav-links" *ngIf="!isSearchOpen">
          <a (click)="onNavClick('home')">Home</a>
          <a (click)="onNavClick('tv')">TV Shows</a>
          <a (click)="onNavClick('movies')">Movies</a>
          <a (click)="onNavClick('new')">New & Popular</a>
          <a (click)="onNavClick('favorites')">My List</a>
        </nav>
      </div>

      <div class="header-right">
        <div class="search-container" *ngIf="isSearchOpen">
          <input
            type="text"
            class="search-input"
            placeholder="Titles, people, genres"
            [(ngModel)]="searchQuery"
            (input)="onSearchInput()"
            (blur)="onSearchBlur()"
            autofocus
          />
          <button class="icon-btn close-search" (click)="toggleSearch()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <button class="icon-btn" (click)="toggleSearch()" *ngIf="!isSearchOpen">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>

        <div class="notification-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
          <span class="notification-badge">3</span>
        </div>

        <div class="profile-menu" *ngIf="isLoggedIn; else loginBtn">
          <img src="https://occ-0-4796-988.1.nflxso.net/dns2/content/restricted/null/null/0.1.gif" alt="Profile" class="avatar" />
          <div class="dropdown">
            <a (click)="onLogout()">Sign out</a>
          </div>
        </div>

        <ng-template #loginBtn>
          <button class="login-btn" (click)="onLoginClick()">Sign In</button>
        </ng-template>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 68px;
      padding: 0 4%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 1000;
      transition: background-color 0.4s ease;
      background: transparent;
    }

    .header.scrolled {
      background: #141414;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 25px;
    }

    .logo {
      cursor: pointer;
      padding: 5px 0;
    }

    .logo-svg {
      width: 92.5px;
      height: 25px;
    }

    .nav-links {
      display: flex;
      gap: 20px;
    }

    .nav-links a {
      color: #e5e5e5;
      text-decoration: none;
      font-size: 14px;
      transition: color 0.4s;
      cursor: pointer;
    }

    .nav-links a:hover {
      color: #b3b3b3;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .icon-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-btn:hover {
      opacity: 0.7;
    }

    .search-container {
      display: flex;
      align-items: center;
      background: rgba(0, 0, 0, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 5px 10px;
    }

    .search-input {
      background: transparent;
      border: none;
      color: white;
      outline: none;
      width: 212px;
      font-size: 14px;
    }

    .search-input::placeholder {
      color: #b3b3b3;
    }

    .notification-btn {
      position: relative;
      cursor: pointer;
      color: white;
    }

    .notification-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #e50914;
      color: white;
      font-size: 10px;
      padding: 2px 5px;
      border-radius: 50%;
    }

    .profile-menu {
      position: relative;
      cursor: pointer;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      object-fit: cover;
    }

    .dropdown {
      display: none;
      position: absolute;
      top: 100%;
      right: 0;
      background: rgba(0, 0, 0, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 10px;
      margin-top: 10px;
    }

    .profile-menu:hover .dropdown {
      display: block;
    }

    .dropdown a {
      color: white;
      text-decoration: none;
      display: block;
      padding: 5px 15px;
      white-space: nowrap;
      cursor: pointer;
    }

    .dropdown a:hover {
      text-decoration: underline;
    }

    .login-btn {
      background: #e50914;
      color: white;
      border: none;
      padding: 8px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }

    .login-btn:hover {
      background: #f40612;
    }

    @media (max-width: 885px) {
      .nav-links {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  @Input() isSearchOpen = false;
  @Input() isLoggedIn = false;
  @Input() isScrolled = false;
  @Input() searchQuery = '';

  @Output() searchToggle = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();
  @Output() loginClick = new EventEmitter<void>();
  @Output() navClick = new EventEmitter<string>();

  toggleSearch(): void {
    this.searchToggle.emit();
  }

  onSearchInput(): void {
    this.searchChange.emit(this.searchQuery);
  }

  onSearchBlur(): void {
    if (!this.searchQuery.trim()) {
      this.searchToggle.emit();
    }
  }

  onLogout(): void {
    this.logout.emit();
  }

  onLoginClick(): void {
    this.loginClick.emit();
  }

  onNavClick(section: string): void {
    this.navClick.emit(section);
  }

  onLogoClick(): void {
    this.navClick.emit('home');
  }
}
