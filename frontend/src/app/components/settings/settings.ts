import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
})
export class Settings {
  // Preferencias de usuario
  darkMode: boolean = false;
  notifications: boolean = true;
  soundEffects: boolean = true;

  // Información de perfil
  username: string = 'Estudiante';
  email: string = 'student@anistudy.com';

  constructor(private router: Router) {}

  saveChanges(): void {
    console.log('💾 Guardando cambios de configuración...');
    console.log('Dark Mode:', this.darkMode);
    console.log('Notifications:', this.notifications);
    console.log('Sound Effects:', this.soundEffects);
    console.log('Username:', this.username);
    console.log('Email:', this.email);
    
    alert('¡Ajustes guardados correctamente! ✨');
  }

  logout(): void {
    console.log('👋 Cerrando sesión...');
    
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      // Aquí podrías limpiar el localStorage o sessionStorage
      // localStorage.clear();
      
      alert('Cerrando sesión...');
      this.router.navigate(['/login']);
    }
  }
}
