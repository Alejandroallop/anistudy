import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-pomodoro',
  standalone: false,
  templateUrl: './pomodoro.html',
  styleUrls: ['./pomodoro.scss']
})
export class Pomodoro implements OnDestroy {
  // Timer variables
  minutes: number = 25;
  seconds: number = 0;
  isRunning: boolean = false;
  currentMode: 'focus' | 'break' = 'focus';

  private intervalId: any = null;

  // Duraciones en minutos
  private readonly FOCUS_TIME = 25;
  private readonly SHORT_BREAK = 5;
  private readonly LONG_BREAK = 15;

  // Audio Player variables
  private audio: HTMLAudioElement | null = null;
  isMusicPlaying: boolean = false;

  // Sonido de victoria
  private finishSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');

  // Inyectar ChangeDetectorRef para forzar la detección de cambios
  constructor(private cdr: ChangeDetectorRef) {
    this.initAudio();
    this.finishSound.volume = 0.6; // Volumen del sonido de victoria
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
  toggleMusic() {
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
            console.error('Error al reproducir audio:', error);
            // El navegador puede bloquear autoplay
            alert('Por favor, interactúa con la página primero para reproducir música.');
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

    // 🎉 REPRODUCIR SONIDO DE VICTORIA
    try {
      this.finishSound.currentTime = 0; // Reiniciar sonido
      this.finishSound.play().catch(err => console.error('Error reproduciendo sonido:', err));
    } catch (error) {
      console.error('Error con sonido de victoria:', error);
    }

    // 🎊 LANZAR CONFETTI EXPLOSIVO
    this.launchConfetti();

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
