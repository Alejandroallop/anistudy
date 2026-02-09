import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  standalone: false,
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  userName: string = 'Estudiante';

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Obtener nombre del usuario desde localStorage
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      this.userName = storedName;
    }
  }

  /**
   * Logout: Limpiar datos y redirigir a login
   */
  onLogout(): void {
    localStorage.removeItem('userName');
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}

