import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { API_BASE_URL } from 'config';

export interface UserStats {
  level: number;
  currentXP: number;
  xpInLevel: number;
  xpInCurrentLevel: number; // Backend devuelve esto
  nextLevelXP: number;
  completedQuests: number;
  pendingQuests: number;
  inProgressQuests: number;
  totalQuests: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${API_BASE_URL}/users`;
  private statsUrl = `${this.apiUrl}/stats`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  getStats(): Observable<UserStats> {
    return this.http.get<UserStats>(this.statsUrl, { headers: this.getHeaders() });
  }

  addFocusTime(minutes: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/focus-time`, { minutes }, { headers });
  }
}
