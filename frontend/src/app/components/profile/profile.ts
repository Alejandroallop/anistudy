import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

interface UserProfile {
  name: string;
  title: string;
  level: number;
  avatar: string;
  xp: {
    current: number;
    next: number;
  };
  stats: {
    hours: number;
    tasks: number;
    streak: number;
  };
  attributes: {
    intelligence: number;
    discipline: number;
    creativity: number;
  };
  achievements: string[];
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile implements OnInit {
  user: UserProfile = {
    name: 'Estudiante',
    title: 'Novato',
    level: 1,
    avatar: 'assets/images/avatar.png',
    xp: {
      current: 0,
      next: 100
    },
    stats: {
      hours: 0,
      tasks: 0,
      streak: 0
    },
    attributes: {
      intelligence: 10,
      discipline: 10,
      creativity: 10
    },
    achievements: []
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // 1. Carga inmediata desde caché local (sin esperar al servidor)
    const localData = this.authService.getUser();
    if (localData) {
      this.mapUserData(localData);
    }

    // 2. Petición al servidor para obtener datos frescos de MongoDB
    this.authService.getFreshProfile().subscribe({
      next: (freshData) => {
        this.mapUserData(freshData);
      },
      error: (err) => {
        console.error('⚠️ No se pudo obtener el perfil fresco del servidor:', err);
      }
    });
  }

  private mapUserData(userData: any): void {
    // Datos básicos
    this.user.name   = userData.name  || 'Estudiante';
    this.user.level  = userData.level || 1;
    this.user.avatar = userData.avatar || 'assets/images/avatar.png';
    this.user.title  = `Estudiante Nivel ${this.user.level}`;

    // XP
    this.user.xp.current = userData.xp || 0;
    this.user.xp.next    = (this.user.level * 100) + 100;

    // Stats
    this.user.stats.tasks  = userData.stats?.tasksCompleted || 0;
    this.user.stats.streak = userData.stats?.streak         || 0;
    this.user.stats.hours  = Math.floor((userData.focusTime || 0) / 60);

    // Atributos RPG
    this.user.attributes.intelligence = userData.attributes?.intelligence || 10;
    this.user.attributes.discipline   = userData.attributes?.discipline   || 10;
    this.user.attributes.creativity   = userData.attributes?.creativity   || 10;

    // Logros
    this.user.achievements = userData.achievements || [];
  }

  get xpPercentage(): number {
    return (this.user.xp.current / this.user.xp.next) * 100;
  }
}
