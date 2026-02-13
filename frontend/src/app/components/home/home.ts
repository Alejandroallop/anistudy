import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  stats: any = null;
  userXp: number = 0;
  userLevel: number = 1;
  missionsCompleted: number = 0;
  nextLevelXp: number = 100;

  constructor(
    private dashboardService: DashboardService, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef
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
        const statsData = data as any; // Re-add missing declaration
        // Mapeo RPG:
        // userXp = Progreso relativo dentro del nivel (ya calculado por backend)
        this.userXp = statsData.currentXP || 0; 
        
        // nextLevelXp = Meta del nivel actual (ya calculado por backend)
        this.nextLevelXp = statsData.nextLevelXP || 100;
        
        this.userLevel = statsData.level || 1;
        this.missionsCompleted = statsData.completedQuests || 0;

        console.log('Stats cargadas:', { 
            xp: this.userXp, 
            level: this.userLevel, 
            completed: this.missionsCompleted 
        });
        
        // Forzar actualización de la vista (Fix asíncrono)
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando stats:', err)
    });
  }
}
