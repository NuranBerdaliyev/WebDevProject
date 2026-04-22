import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface AppNotification {
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationSubject = new BehaviorSubject<AppNotification | null>(null);
  readonly notification$ = this.notificationSubject.asObservable();

  show(message: string, type: NotificationType = 'info'): void {
    this.notificationSubject.next({ message, type });

    setTimeout(() => {
      this.clear();
    }, 3000);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  clear(): void {
    this.notificationSubject.next(null);
  }
}