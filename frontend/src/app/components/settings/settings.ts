import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
})
export class Settings implements OnInit {
  // Preferencias de usuario
  darkMode = false;
  notifications = true;
  soundEffects = true;

  // Información de perfil (solo lectura)
  username = '';
  email = '';
  avatarUrl = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // --- Fase 1: Cargar datos del usuario desde AuthService ---
    const user = this.authService.getUser();
    if (user) {
      this.username = user.name || 'Estudiante';
      this.email = user.email || '';
      this.avatarUrl = user.avatar || 'assets/images/avatar_demo.png';
    }

    // --- Fase 2: Leer preferencias guardadas en localStorage ---
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    this.notifications = localStorage.getItem('notifications') !== 'false';
    this.soundEffects = localStorage.getItem('soundEffects') !== 'false';
  }

  saveChanges(): void {
    // Persistir en localStorage
    localStorage.setItem('darkMode', String(this.darkMode));
    localStorage.setItem('notifications', String(this.notifications));
    localStorage.setItem('soundEffects', String(this.soundEffects));

    // Aplicar Modo Oscuro al DOM en tiempo real
    if (this.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }



    // Feedback visual sin alert nativo
    const btn = document.querySelector('.c-btn--primary') as HTMLButtonElement;
    if (btn) {
      const original = btn.textContent;
      btn.textContent = '✅ ¡Guardado!';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 2000);
    }
  }

  logout(): void {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      document.body.classList.remove('dark-theme');
      this.authService.logout();
    }
  }
}
