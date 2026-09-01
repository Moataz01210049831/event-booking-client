export interface Category {
  id: string;
  name: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string | null;
}

export interface CreateLocationRequest {
  name: string;
  address: string;
  city?: string;
}

export interface Hall {
  id: string;
  name: string;
  locationId: string;
  locationName: string;
}

export interface CreateHallRequest {
  name: string;
  locationId: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  imageUrl?: string;
  startDateUtc: string;
  endDateUtc: string;
  hallId: string;
  categoryId: string;
}