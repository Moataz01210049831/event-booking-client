import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CreateCategoryRequest, Location, CreateLocationRequest, Hall, CreateHallRequest, CreateEventRequest } from '../modals/admin.models';
import { EventDetails } from '../modals/events.model';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  createCategory(request: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, request);
  }

  // Locations
  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations`);
  }

  createLocation(request: CreateLocationRequest): Observable<Location> {
    return this.http.post<Location>(`${this.apiUrl}/locations`, request);
  }

  // Halls
  getHalls(): Observable<Hall[]> {
    return this.http.get<Hall[]>(`${this.apiUrl}/halls`);
  }

  createHall(request: CreateHallRequest): Observable<Hall> {
    return this.http.post<Hall>(`${this.apiUrl}/halls`, request);
  }

  // Events
  createEvent(request: CreateEventRequest): Observable<EventDetails> {
    return this.http.post<EventDetails>(`${this.apiUrl}/events`, request);
  }
}