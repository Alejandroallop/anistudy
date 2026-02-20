import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from 'config';

export interface CalendarEvent {
  _id?: string;
  title: string;
  start: string | Date;
  end?: string | Date;
  type: 'exam' | 'delivery' | 'class';
  allDay?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${API_BASE_URL}/events`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  getEvents(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createEvent(event: CalendarEvent): Observable<CalendarEvent> {
    return this.http.post<CalendarEvent>(this.apiUrl, event, { headers: this.getHeaders() });
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
