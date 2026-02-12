import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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
  private apiUrl = 'http://localhost:3000/api/users/stats';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  getStats(): Observable<UserStats> {
    return this.http.get<UserStats>(this.apiUrl, { headers: this.getHeaders() });
  }
}
