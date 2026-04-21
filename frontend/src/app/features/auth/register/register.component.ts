import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  errorMessage = '';

  readonly registerForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
  
    const registerData = {
      username: this.registerForm.value.username ?? '',
      email: this.registerForm.value.email ?? '',
      password: this.registerForm.value.password ?? ''
    };
  
    this.authService.register(registerData).subscribe({
      next: () => {
        this.notificationService.success('Registration successful');
        this.router.navigateByUrl('/login');
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.notificationService.error(error.message);
      }
    });
  }
}