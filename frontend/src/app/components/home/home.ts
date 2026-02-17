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

  // Nuevas propiedades del dashboard
  focusTimeFormatted: string = '0h 0m';
  userStreak: number = 1;
  activeQuests: any[] = [];
  nextEvent: any = null;
  daysToEvent: number = 0;

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
        const statsData = data as any;

        // Mapeo RPG
        this.userXp = statsData.currentXP || 0; 
        this.nextLevelXp = statsData.nextLevelXP || 100;
        this.userLevel = statsData.level || 1;
        this.missionsCompleted = statsData.completedQuests || 0;

        // Formatear tiempo de enfoque
        const mins = statsData.focusTime || 0;
        this.focusTimeFormatted = Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm';

        // Racha y misiones activas
        this.userStreak = statsData.streak || 1;
        this.activeQuests = statsData.activeQuests || [];

        // Próximo evento y días restantes
        this.nextEvent = statsData.nextEvent;
        if (this.nextEvent) {
          const diff = new Date(this.nextEvent.start).getTime() - new Date().getTime();
          this.daysToEvent = Math.ceil(diff / (1000 * 3600 * 24));
        }

        console.log('📊 Stats completas cargadas:', { 
          xp: this.userXp, 
          level: this.userLevel, 
          completed: this.missionsCompleted,
          focusTime: this.focusTimeFormatted,
          streak: this.userStreak,
          activeQuests: this.activeQuests.length,
          nextEvent: this.nextEvent?.title
        });
        
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando stats:', err)
    });
  }
}
