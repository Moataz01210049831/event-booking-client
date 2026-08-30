import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EventDetails, Seat } from '../../../core/modals/events.model';
import { EventService } from '../../../core/Services/events.service';
import { AuthService } from '../../../core/Services/auth.service';
import { BookingService } from '../../../core/Services/booking.service';
import { NotificationService } from '../../../core/Services/notification.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.scss'
})
export class EventDetailsComponent implements OnInit {
  event = signal<EventDetails | null>(null);
  isLoading = signal(true);
  selectedSeats = signal<Seat[]>([]);
 @Input() id!: string;   // ← بديل paramMap.get('id')
 isBooking = signal(false);

  constructor(
    private route: Router,
    private eventService: EventService,
    private authService: AuthService,
    private bookingService: BookingService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    

    this.eventService.getEventById(this.id).subscribe({
      next: (data) => {
        this.event.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  toggleSeat(seat: Seat): void {
    if (seat.status !== 'Available') return;

    const current = this.selectedSeats();
    const isSelected = current.some(s => s.eventSeatId === seat.eventSeatId);

    if (isSelected) {
      this.selectedSeats.set(current.filter(s => s.eventSeatId !== seat.eventSeatId));
    } else {
      this.selectedSeats.set([...current, seat]);
    }
  }

  isSeatSelected(seat: Seat): boolean {
    return this.selectedSeats().some(s => s.eventSeatId === seat.eventSeatId);
  }

  get totalPrice(): number {
    return this.selectedSeats().reduce((sum, s) => sum + s.price, 0);
  }

  get seatRows(): string[] {
    const seats = this.event()?.seats ?? [];
    const rows = [...new Set(seats.map(s => s.rowLabel))];
    return rows.sort();
  }

  seatsInRow(row: string): Seat[] {
    const seats = this.event()?.seats ?? [];
    return seats
      .filter(s => s.rowLabel === row)
      .sort((a, b) => Number(a.seatNumber) - Number(b.seatNumber));
  }

  onConfirmBooking(): void {
  console.log('isLoggedIn:', this.authService.isLoggedIn());
  
  if (!this.authService.isLoggedIn()) {
    this.route.navigate(['/login'], {
      queryParams: { returnUrl: this.route.url }
    });
    return;
  }
if (this.selectedSeats().length === 0) {
      this.notification.showError('اختار مقعد واحد على الأقل');
      return;
    }
this.isBooking.set(true);

 const request = {
      eventSeatIds: this.selectedSeats().map(s => s.eventSeatId)
    };

      this.bookingService.holdSeats(request).subscribe({
      next: (response) => {
        this.isBooking.set(false);
        this.notification.showSuccess('تم حجز مقاعدك مؤقتًا، أكمل الحجز خلال 10 دقائق');
        // هنكمل بعدين: نروح لصفحة تأكيد الحجز/الدفع
        console.log('Booking created:', response);
      },
      error: () => {
        this.isBooking.set(false);
      }
    });
  }
 
}
