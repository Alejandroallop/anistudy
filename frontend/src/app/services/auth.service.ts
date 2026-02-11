import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Registrar usuario
   */
  register(userData: any): Observable<any> {
    console.log('🚀 Intentando registrar en:', this.apiUrl, userData);
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap({
        next: (response: any) => {
          if (response && response.token) {
            this.saveSession(response.token, response);
          }
        },
        error: (error) => {
          console.error('❌ Error de red/servidor:', error);
        }
      })
    );
  }

  /**
   * Login usuario
   */
  login(credentials:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          this.saveSession(response.token, response);
        }
      })
    );
  }

  /**
   * Guardar sesión
   */
  private saveSession(token: string, user: any): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    // También guardamos el nombre para compatibilidad con código existente
    localStorage.setItem('userName', user.name); 
  }

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }

  /**
   * Verificar si está logueado
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  /**
   * Obtener token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Obtener usuario actual
   */
  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }
}
