import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  handleError(error: HttpErrorResponse) {
    let message = 'Something went wrong. Please try again later.';

    if (error.status === 0) {
      message = 'Cannot connect to the server. Please check your internet or backend connection.';
    } else if (error.status === 400) {
      message = this.extractServerMessage(error) || 'Invalid request. Please check the entered data.';
    } else if (error.status === 401) {
      message = 'You need to log in first.';
    } else if (error.status === 403) {
      message = 'You do not have permission to perform this action.';
    } else if (error.status === 404) {
      message = 'Requested resource was not found.';
    } else if (error.status >= 500) {
      message = 'Server error. Please try again later.';
    }

    return throwError(() => new Error(message));
  }

  private extractServerMessage(error: HttpErrorResponse): string | null {
    if (!error.error) {
      return null;
    }

    if (typeof error.error === 'string') {
      return error.error;
    }

    if (typeof error.error.detail === 'string') {
      return error.error.detail;
    }

    return null;
  }
}