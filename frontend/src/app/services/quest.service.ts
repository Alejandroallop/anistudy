import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Quest {
  _id?: string;
  title: string;
  description?: string;
  rank?: 'S' | 'A' | 'B' | 'C' | 'D';
  xp?: number;
  status: 'pending' | 'in-progress' | 'completed';
  tag?: string; // Optional for frontend UI mapping
}

@Injectable({
  providedIn: 'root'
})
export class QuestService {
  private apiUrl = 'https://anistudy-backend.onrender.com/api/quests';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    // El usuario pidió explícitamente usar localStorage.getItem('token'), pero el AuthService usa 'auth_token'.
    // Usaremos lo que REALMENTE funciona según el AuthService: 'auth_token'.
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  getQuests(): Observable<Quest[]> {
    return this.http.get<Quest[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createQuest(quest: Quest): Observable<Quest> {
    return this.http.post<Quest>(this.apiUrl, quest, { headers: this.getHeaders() });
  }

  updateQuest(id: string, updates: Partial<Quest>): Observable<Quest> {
    return this.http.put<Quest>(`${this.apiUrl}/${id}`, updates, { headers: this.getHeaders() });
  }

  completeQuest(id: string): Observable<Quest> {
    // Mantenemos este método por compatibilidad, pero internamente usa updateQuest
    return this.updateQuest(id, { status: 'completed' });
  }

  deleteQuest(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
