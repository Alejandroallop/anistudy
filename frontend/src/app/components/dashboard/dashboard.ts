import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  standalone: false,
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  userName = 'Estudiante';
  userLevel = 1;
  userAvatar = '/assets/images/avatar.png'; // Fallback
  userXp = 0;
  userAchievements: any[] = [];

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name || 'Estudiante';
      this.userLevel = user.level || 1;
      this.userXp = user.xp || 0;

      // Mapear avatar ID a ruta de imagen si es necesario
      if (user.avatar && !user.avatar.includes('/')) {
        this.userAvatar = user.avatar === 'kenji' ? '/assets/images/avatar-kenji.png' : '/assets/images/avatar.png';
      } else if (user.avatar) {
        this.userAvatar = user.avatar;
      }
    }

    // Obtener datos frescos del backend para mantener reactividad
    this.authService.getFreshProfile().subscribe({
      next: (freshUser: any) => {
        this.userName = freshUser.name || this.userName;
        this.userLevel = freshUser.level || this.userLevel;
        this.userXp = freshUser.xp || this.userXp;
        this.userAchievements = freshUser.achievements || [];

        if (freshUser.avatar && !freshUser.avatar.includes('/')) {
          this.userAvatar = freshUser.avatar === 'kenji' ? '/assets/images/avatar-kenji.png' : '/assets/images/avatar.png';
        } else if (freshUser.avatar) {
          this.userAvatar = freshUser.avatar;
        }
      },
      error: (err: any) => {
        console.log('⚠️ No se pudo obtener el perfil fresco:', err);
      }
    });
  }

  /**
   * Logout: Limpiar datos y redirigir a login
   */
  onLogout(): void {
    this.authService.logout();
  }
}

