import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showError(message: string): void {
    this.snackBar.open(message, 'إغلاق', {
      duration: 4000,
      panelClass: ['toast-error'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'إغلاق', {
      duration: 3000,
      panelClass: ['toast-success'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}