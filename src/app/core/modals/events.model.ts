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