import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from 'config';

export interface Resource {
  _id?: string;
  name: string;
  type: 'PDF' | 'Link' | 'Video';
  icon?: string;
  description?: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private apiUrl = `${API_BASE_URL}/resources`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  getResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createResource(resource: Resource): Observable<Resource> {
    return this.http.post<Resource>(this.apiUrl, resource, { headers: this.getHeaders() });
  }

  deleteResource(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
