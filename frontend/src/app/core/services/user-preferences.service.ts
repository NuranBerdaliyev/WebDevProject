import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'en' | 'ru';
  notificationsEnabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private readonly storageKey = 'user_preferences';

  private readonly preferencesSubject = new BehaviorSubject<UserPreferences>(
    this.getStoredPreferences()
  );

  readonly preferences$ = this.preferencesSubject.asObservable();

  getPreferences(): UserPreferences {
    return this.preferencesSubject.value;
  }

  updatePreferences(prefs: Partial<UserPreferences>): void {
    const updated = {
      ...this.preferencesSubject.value,
      ...prefs
    };

    this.preferencesSubject.next(updated);
    this.savePreferences(updated);
  }

  resetPreferences(): void {
    const defaultPrefs: UserPreferences = {
      theme: 'light',
      language: 'en',
      notificationsEnabled: true
    };

    this.preferencesSubject.next(defaultPrefs);
    this.savePreferences(defaultPrefs);
  }

  private savePreferences(prefs: UserPreferences): void {
    localStorage.setItem(this.storageKey, JSON.stringify(prefs));
  }

  private getStoredPreferences(): UserPreferences {
    const stored = localStorage.getItem(this.storageKey);

    if (!stored) {
      return {
        theme: 'light',
        language: 'en',
        notificationsEnabled: true
      };
    }

    try {
      return JSON.parse(stored) as UserPreferences;
    } catch {
      localStorage.removeItem(this.storageKey);
      return {
        theme: 'light',
        language: 'en',
        notificationsEnabled: true
      };
    }
  }
}