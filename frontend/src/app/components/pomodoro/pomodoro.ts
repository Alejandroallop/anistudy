import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pomodoro',
  standalone: false,
  templateUrl: './pomodoro.html',
  styleUrls: ['./pomodoro.scss']
})
export class Pomodoro implements OnDestroy {
  // Timer variables
  minutes = 25;
  seconds = 0;
  isRunning = false;
  currentMode: 'focus' | 'break' = 'focus';

  private intervalId: any = null;

  // Duraciones en minutos
  private readonly FOCUS_TIME = 25;
  private readonly SHORT_BREAK = 5;
  private readonly LONG_BREAK = 15;

  // Audio Player variables
  private audio: HTMLAudioElement | null = null;
  isMusicPlaying = false;

  // Sonido de victoria
  private finishSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');

  // Inyectar ChangeDetectorRef y DashboardService
  constructor(
    private cdr: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {
    this.initAudio();
    this.finishSound.volume = 0.6;
  }

  /**
   * Inicializa el reproductor de audio
   */
  private initAudio() {
    // URL de la radio Lofi (Zeno.fm)
    this.audio = new Audio('https://stream.zeno.fm/0r0xa854rp8uv');

    // Configurar volumen inicial al 50%
    this.audio.volume = 0.5;

    // Configurar loop para que siga reproduciendo
    this.audio.loop = true;

    // Manejar errores (si la URL principal falla, usar respaldo)
    this.audio.addEventListener('error', () => {
      console.warn('Error con URL principal, cambiando a URL de respaldo...');
      if (this.audio) {
        this.audio.src = 'https://streams.ilovemusic.de/iloveradio17.mp3';
        this.audio.load();
      }
    });
  }

  /**
   * Toggle para reproducir/pausar música
   */
  toggleAudio() {
    if (!this.audio) return;

    try {
      if (!this.isMusicPlaying) {
        // Reproducir música
        this.audio.play()
          .then(() => {
            this.isMusicPlaying = true;
            this.cdr.detectChanges();
          })
          .catch(error => {
            console.warn('Fallo de audio silencioso:', error);
          });
      } else {
        // Pausar música
        this.audio.pause();
        this.isMusicPlaying = false;
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error en toggleMusic:', error);
    }
  }

  /**
   * Inicia el timer
   */
  startTimer() {
    if (this.isRunning) return;

    // Auto-start music if not playing
    if (!this.isMusicPlaying && this.audio) {
      this.toggleAudio();
    }

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.tick();
      // CRÍTICO: Forzar detección de cambios
      this.cdr.detectChanges();
    }, 1000);
  }

  /**
   * Pausa el timer
   */
  pauseTimer() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    // Forzar actualización al pausar
    this.cdr.detectChanges();
  }

  /**
   * Reinicia el timer al modo actual
   */
  resetTimer() {
    this.pauseTimer();
    if (this.currentMode === 'focus') {
      this.minutes = this.FOCUS_TIME;
    }
    this.seconds = 0;
    this.cdr.detectChanges();
  }

  /**
   * Cambia a modo descanso corto o largo
   */
  setBreakMode(type: 'short' | 'long') {
    this.pauseTimer();
    this.currentMode = 'break';
    this.minutes = type === 'short' ? this.SHORT_BREAK : this.LONG_BREAK;
    this.seconds = 0;
    this.cdr.detectChanges();
  }

  /**
   * Cuenta atrás (tick del reloj)
   */
  private tick() {
    if (this.seconds === 0) {
      if (this.minutes === 0) {
        // Timer completado
        this.onTimerComplete();
        return;
      }
      this.minutes--;
      this.seconds = 59;
    } else {
      this.seconds--;
    }
  }

  /**
   * Maneja la finalización del timer - CELEBRACIÓN ÉPICA
   */
  private onTimerComplete() {
    this.pauseTimer();

    // 🎉 SONIDO Y CONFETTI (respetan preferencias del usuario)
    if (localStorage.getItem('soundEffects') !== 'false') {
      // 🎉 REPRODUCIR SONIDO DE VICTORIA
      try {
        this.finishSound.currentTime = 0;
        this.finishSound.play().catch(err => console.error('Error reproduciendo sonido:', err));
      } catch (error) {
        console.error('Error con sonido de victoria:', error);
      }

      // 🎊 LANZAR CONFETTI EXPLOSIVO
      this.launchConfetti();
    }

    // 📊 REGISTRAR TIEMPO DE ENFOQUE + ALERTAS
    if (this.currentMode === 'focus') {
      const oldLevel = this.authService.getUser()?.level || 1;

      this.dashboardService.addFocusTime(this.FOCUS_TIME).subscribe({
        next: () => {
          // Traer perfil actualizado del servidor
          this.authService.getFreshProfile().subscribe({
            next: (freshData) => {
              if (freshData.level > oldLevel) {
                // 👑 SUBIDA DE NIVEL — alerta épica
                Swal.fire({
                  title: '⚔️ ¡SUBIDA DE NIVEL!',
                  html: `
                    <div style="font-family: 'Segoe UI', sans-serif; color: #e2e8f0;">
                      <p style="font-size: 1.3rem; margin-bottom: 8px;">Has alcanzado el
                        <strong style="color: #f6c90e;">Nivel ${freshData.level}</strong> 🌟
                      </p>
                      <p style="color: #a0aec0; font-size: 0.95rem;">
                        Tus atributos aumentan <strong style="color: #68d391;">+2</strong>:<br>
                        🧠 INT &nbsp;|&nbsp; 🎯 DIS &nbsp;|&nbsp; 🎨 CRE
                      </p>
                    </div>`,
                  icon: 'success',
                  background: '#1a1a2e',
                  color: '#e2e8f0',
                  confirmButtonText: '¡A seguir estudiando! 🔥',
                  confirmButtonColor: '#6c63ff',
                  showClass: { popup: 'animate__animated animate__bounceIn' }
                });
              } else {
                // ⭐ SESIÓN COMPLETADA — toast sencillo
                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'success',
                  title: `¡Sesión Completada!`,
                  text: `Has ganado +${this.FOCUS_TIME * 5} XP 💫`,
                  background: '#1a1a2e',
                  color: '#e2e8f0',
                  showConfirmButton: false,
                  timer: 3500,
                  timerProgressBar: true
                });
              }
            },
            error: (err) => console.error('Error al obtener perfil fresco:', err)
          });
        },
        error: (err) => console.error('❌ Error registrando tiempo de enfoque:', err)
      });
    }

    // Cambiar automáticamente al siguiente modo
    if (this.currentMode === 'focus') {
      this.currentMode = 'break';
      this.minutes = this.SHORT_BREAK;
    } else {
      this.currentMode = 'focus';
      this.minutes = this.FOCUS_TIME;
    }
    this.seconds = 0;
    this.cdr.detectChanges();
  }

  /**
   * Lanza confetti explosivo
   */
  private launchConfetti() {
    // Primera explosión desde el centro
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Segunda explosión tras un pequeño delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
    }, 250);

    // Tercera explosión desde la derecha
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 400);
  }

  /**
   * Limpia el intervalo y el audio al destruir el componente
   */
  ngOnDestroy() {
    // Limpiar timer
    this.pauseTimer();

    // Limpiar audio
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }

    this.isMusicPlaying = false;
  }
}
