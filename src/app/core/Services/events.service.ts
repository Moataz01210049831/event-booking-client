import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventListItem } from '../modals/events.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
private readonly apiUrl = `${environment.apiUrl}/events`;
  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<EventListItem[]> {
    return this.http.get<EventListItem[]>(this.apiUrl);
  }
}