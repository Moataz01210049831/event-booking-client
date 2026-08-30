export interface HoldSeatsRequest {
  eventSeatIds: string[];
}

export interface BookedSeat {
  eventSeatId: string;
  rowLabel: string;
  seatNumber: string;
  price: number;
}

export interface BookingResponse {
  bookingId: string;
  status: string;
  totalAmount: number;
  holdExpiresAtUtc: string;
  seats: BookedSeat[];
}


export interface MyBooking {
  bookingId: string;
  eventTitle: string;
  eventStartDateUtc: string;
  hallName: string;
  locationName: string;
  status: string;
  totalAmount: number;
  bookingDateUtc: string;
  seats: BookedSeat[];
}