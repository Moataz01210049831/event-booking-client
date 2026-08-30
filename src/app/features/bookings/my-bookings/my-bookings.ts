import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MyBooking } from '../../../core/modals/booking.model';
import { BookingService } from '../../../core/Services/booking.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.scss'
})
export class MyBookingsComponent implements OnInit {
  bookings = signal<MyBooking[]>([]);
  isLoading = signal(true);

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      Pending: 'في الانتظار',
      Confirmed: 'مؤكد',
      Cancelled: 'ملغي',
      Expired: 'منتهي'
    };
    return labels[status] ?? status;
  }
}