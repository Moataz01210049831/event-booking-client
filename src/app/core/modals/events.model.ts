export interface EventListItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  startDateUtc: string;
  endDateUtc: string;
  categoryName: string;
  hallName: string;
  locationName: string;
  availableSeatsCount: number;
}

export interface Seat {
  eventSeatId: string;
  rowLabel: string;
  seatNumber: string;
  seatType: string;
  price: number;
  status: string;
}

export interface EventDetails {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  startDateUtc: string;
  endDateUtc: string;
  categoryName: string;
  hallName: string;
  locationName: string;
  seats: Seat[];
}