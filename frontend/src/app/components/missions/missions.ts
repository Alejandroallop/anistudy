import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { Quest, QuestService } from '../../services/quest.service';
import { AuthService } from '../../services/auth.service';

// Interface adaptada a lo que devuelve el backend (Quest)
// Mapearemos 'status' pending -> todo/doing/done en el frontend o usaremos directamente lo que hay.
// El backend solo tiene 'pending' y 'completed', así que adaptaremos la UI.


@Component({
  selector: 'app-missions',
  standalone: false,
  templateUrl: './missions.html',
  styleUrls: ['./missions.scss']
})
export class Missions implements OnInit {
  quests: Quest[] = [];
  showModal = false;
  newQuest: Partial<Quest> = {
    title: '',
    description: '',
    rank: 'C',
    xp: 10,
    status: 'pending'
  };

  constructor(
    private questService: QuestService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🔄 Iniciando MissionsComponent, cargando datos...');
    this.loadQuests();
  }

  loadQuests(): void {
    this.questService.getQuests().subscribe({
      next: (data) => {
        this.quests = data;
        console.log('Misiones cargadas:', this.quests);
        this.cdr.markForCheck(); // Forzar detección de cambios
      },
      error: (err) => console.error('Error al cargar misiones:', err)
    });
  }

  get todoQuests(): Quest[] {
    return this.quests.filter(q => q.status === 'pending');
  }

  get inProgressQuests(): Quest[] {
    return this.quests.filter(q => q.status === 'in-progress');
  }

  get completedQuests(): Quest[] {
    return this.quests.filter(q => q.status === 'completed');
  }

  advanceQuest(quest: Quest): void {
    if (!quest._id) return;

    let nextStatus: 'pending' | 'in-progress' | 'completed' = 'pending';

    if (quest.status === 'pending') {
      nextStatus = 'in-progress';
    } else if (quest.status === 'in-progress') {
      nextStatus = 'completed';
    } else {
      return; // Ya está completada
    }

    // Guardar nivel actual antes de la petición
    const levelBefore = this.authService.getUser()?.level ?? 1;

    this.questService.updateQuest(quest._id, { status: nextStatus }).subscribe({
      next: (updatedQuest) => {
        console.log(`Misión actualizada a ${nextStatus}:`, updatedQuest);

        // Actualizar localmente
        const index = this.quests.findIndex(q => q._id === updatedQuest._id);
        if (index !== -1) {
          this.quests[index] = updatedQuest;
        }
        this.cdr.detectChanges();

        // Si la misión se completó, verificar subida de nivel
        if (nextStatus === 'completed') {
          this.authService.getFreshProfile().subscribe({
            next: (freshData) => {
              const levelAfter = freshData.level ?? 1;
              if (levelAfter > levelBefore) {
                Swal.fire({
                  title: '⚔️ ¡SUBIDA DE NIVEL!',
                  html: `
                    <div style="font-family: 'Segoe UI', sans-serif; color: #e2e8f0;">
                      <p style="font-size: 1.3rem; margin-bottom: 8px;">Has alcanzado el
                        <strong style="color: #f6c90e;">Nivel ${levelAfter}</strong> 🌟
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
                  showClass: {
                    popup: 'animate__animated animate__bounceIn'
                  }
                });
              }
            },
            error: (err) => console.error('Error al obtener perfil fresco:', err)
          });
        }
      },
      error: (err) => console.error('Error al actualizar misión:', err)
    });
  }

  openModal(): void {
    this.showModal = true;
    this.newQuest = {
      title: '',
      description: '',
      rank: 'C',
      xp: 50, // Default C
      status: 'pending'
    };
  }

  closeModal(): void {
    this.showModal = false;
  }

  updateXpByRank(): void {
      switch (this.newQuest.rank) {
          case 'S': this.newQuest.xp = 500; break;
          case 'A': this.newQuest.xp = 250; break;
          case 'B': this.newQuest.xp = 100; break;
          case 'C': this.newQuest.xp = 50; break;
          default: this.newQuest.xp = 50;
      }
  }

  saveQuest(): void {
    console.log('Botón guardar clickeado', this.newQuest);
    if (!this.newQuest.title || !this.newQuest.description) {
        console.warn('Faltan campos requeridos');
        return;
    }

    // Asegurar XP correcta por si acaso
    this.updateXpByRank();

    this.questService.createQuest(this.newQuest as Quest).subscribe({
      next: (createdQuest) => {
        console.log('Misión creada:', createdQuest);
        this.closeModal();
        this.loadQuests(); // Refrescar la lista inmediatamente
      },
      error: (err) => console.error('Error al crear misión:', err)
    });
  }

  deleteQuest(id: string, event: Event): void {
    event.stopPropagation(); // Evitar que el click se propague a la tarjeta y cambie el estado
    
    if (confirm('¿Estás seguro de que quieres borrar esta misión?')) {
      this.questService.deleteQuest(id).subscribe({
        next: () => {
          console.log('Misión eliminada:', id);
          // Opción 1: Recargar todo (más seguro)
          this.loadQuests(); 
        },
        error: (err) => console.error('Error al eliminar misión:', err)
      });
    }
  }

  addMission(): void {
    this.openModal();
  }
}
