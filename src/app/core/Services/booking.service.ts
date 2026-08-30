import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HoldSeatsRequest, BookingResponse, MyBooking } from '../modals/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly apiUrl = `${environment.apiUrl}/EventBooking`;

  constructor(private http: HttpClient) {}

  holdSeats(request: HoldSeatsRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/hold-seats`, request);
  }


  confirmBooking(bookingId: string): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/confirm`, { bookingId });
  }


  getMyBookings(): Observable<MyBooking[]> {
    return this.http.get<MyBooking[]>(`${this.apiUrl}/my-bookings`);
  }
}