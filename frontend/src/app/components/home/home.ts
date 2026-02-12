import { Component, OnInit } from '@angular/core';
import { DashboardService, UserStats } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  userName: string = 'Estudiante';
  stats: UserStats | null = null;
  xpProgress: number = 0;
  xpToNext: number = 100;

  constructor(
    private dashboardService: DashboardService, 
    private authService: AuthService
  ) {}

  ngOnInit() {
    // 1. Obtener usuario (nombre)
    const user = this.authService.getUser();
    if (user && user.name) {
      this.userName = user.name;
    }

    // 2. Cargar Estadísticas
    this.loadStats();
  }

  loadStats() {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        // Calcular porcentaje de barra de progreso
        // data.xpInCurrentLevel / data.nextLevelXP * 100
        if (data.nextLevelXP > 0) {
          this.xpProgress = (data.xpInCurrentLevel / data.nextLevelXP) * 100;
          this.xpToNext = data.nextLevelXP - data.xpInCurrentLevel;
        } else {
            this.xpProgress = 100;
            this.xpToNext = 0;
        }
        console.log('Stats cargadas:', this.stats);
      },
      error: (err) => console.error('Error cargando stats:', err)
    });
  }
}
