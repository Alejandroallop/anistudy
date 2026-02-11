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
      intelligence: 50,
      discipline: 50,
      creativity: 50
    },
    achievements: []
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userData = this.authService.getUser();
    if (userData) {
      this.user.name = userData.name || 'Estudiante';
      this.user.level = userData.level || 1;
      this.user.xp.current = userData.xp || 0;
      this.user.xp.next = userData.level * 100 + 100; // Fórmula simple de XP

      // Mapear Avatar
      if (userData.avatar && !userData.avatar.includes('/')) {
        this.user.avatar = userData.avatar === 'kenji' ? '/assets/images/avatar-kenji.png' : '/assets/images/avatar.png';
      } else if (userData.avatar) {
        this.user.avatar = userData.avatar;
      }
      
      // Título basado en nivel (ejemplo simple)
      this.user.title = `Estudiante Nivel ${this.user.level}`;
    }
  }

  get xpPercentage(): number {
    return (this.user.xp.current / this.user.xp.next) * 100;
  }
}
