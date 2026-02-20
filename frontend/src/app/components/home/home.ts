import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  userName = 'Estudiante';
  stats: any = null;
  userXp = 0;
  userLevel = 1;
  missionsCompleted = 0;
  nextLevelXp = 100;

  // Nuevas propiedades del dashboard
  focusTimeFormatted = '0h 0m';
  userStreak = 1;
  activeQuests: any[] = [];
  nextEvent: any = null;
  daysToEvent = 0;

  // Notificaciones
  notificationCount = 0;
  showNotifications = true;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // 1. Obtener usuario (nombre)
    const user = this.authService.getUser();
    if (user && user.name) {
      this.userName = user.name;
    }

    // 2. Leer preferencias de notificaciones
    this.showNotifications = localStorage.getItem('notifications') !== 'false';

    // 3. Cargar Estadísticas
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

        // Contar notificaciones dinámicamente
        this.notificationCount = this.activeQuests.length;
        if (this.nextEvent && this.daysToEvent >= 0 && this.daysToEvent <= 3) {
          this.notificationCount += 1;
        }

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando stats:', err)
    });
  }
}
