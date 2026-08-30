import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookingResponse } from '../../../core/modals/booking.model';
import { BookingService } from '../../../core/Services/booking.service';
import { NotificationService } from '../../../core/Services/notification.service';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './booking-summary.html',
  styleUrl: './booking-summary.scss'
})
export class BookingSummaryComponent implements OnInit, OnDestroy {
  booking = signal<BookingResponse | null>(null);
  isConfirming = signal(false);
  remainingSeconds = signal(0);
  isExpired = signal(false);

  private timerInterval?: ReturnType<typeof setInterval>;

  constructor(
    private router: Router,
    private bookingService: BookingService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const state = this.router.getCurrentNavigation()?.extras.state
      ?? history.state;

    if (!state || !state['booking']) {
      this.router.navigate(['/']);
      return;
    }

    this.booking.set(state['booking']);
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private startCountdown(): void {
    const expiresAt = this.booking()?.holdExpiresAtUtc;
    if (!expiresAt) return;

    const expiryTime = new Date(expiresAt).getTime();

    this.timerInterval = setInterval(() => {
      const secondsLeft = Math.floor((expiryTime - Date.now()) / 1000);

      if (secondsLeft <= 0) {
        this.remainingSeconds.set(0);
        this.isExpired.set(true);
        clearInterval(this.timerInterval);
      } else {
        this.remainingSeconds.set(secondsLeft);
      }
    }, 1000);
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.remainingSeconds() / 60);
    const seconds = this.remainingSeconds() % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  onConfirm(): void {
    const bookingId = this.booking()?.bookingId;
    if (!bookingId) return;

    this.isConfirming.set(true);

    this.bookingService.confirmBooking(bookingId).subscribe({
      next: (response) => {
        this.isConfirming.set(false);
        this.notification.showSuccess('تم تأكيد الحجز بنجاح! 🎉');
        this.booking.set(response);
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
        }
      },
      error: () => {
        this.isConfirming.set(false);
      }
    });
  }
}