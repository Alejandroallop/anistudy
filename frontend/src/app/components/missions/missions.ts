import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Quest, QuestService } from '../../services/quest.service';

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
  showModal: boolean = false;
  newQuest: Partial<Quest> = {
    title: '',
    description: '',
    rank: 'C',
    xp: 10,
    status: 'pending'
  };

  constructor(private questService: QuestService, private cdr: ChangeDetectorRef) {}

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

    this.questService.updateQuest(quest._id, { status: nextStatus }).subscribe({
      next: (updatedQuest) => {
        console.log(`Misión actualizada a ${nextStatus}:`, updatedQuest);
        // Actualizar localmente
        const index = this.quests.findIndex(q => q._id === updatedQuest._id);
        if (index !== -1) {
          this.quests[index] = updatedQuest;
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
      xp: 10,
      status: 'pending'
    };
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveQuest(): void {
    if (!this.newQuest.title || !this.newQuest.description) return;

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
          
          // Opción 2 (Optimista): Filtrar localmente
          // this.quests = this.quests.filter(q => q._id !== id);
        },
        error: (err) => console.error('Error al eliminar misión:', err)
      });
    }
  }

  // Método legacy para mantener compatibilidad si algo llama a addMission,
  // pero la UI ahora llamará a openModal()
  addMission(): void {
    this.openModal();
  }
}
