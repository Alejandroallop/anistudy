import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ResourceService, Resource } from '../../services/resource.service';

interface SubjectResource {
  _id?: string;
  id?: number;
  name: string;
  type: 'PDF' | 'Link' | 'Video';
  icon?: string;
  description?: string;
  url: string;
}

@Component({
  selector: 'app-grimoire',
  standalone: false,
  templateUrl: './grimoire.html',
  styleUrls: ['./grimoire.scss']
})
export class Grimoire implements OnInit {
  searchTerm = '';
  resources: SubjectResource[] = [];
  
  // Modal state
  showModal = false;
  newResource: Resource = {
    name: '',
    type: 'PDF',
    url: '',
    description: ''
  };

  constructor(
    private resourceService: ResourceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.resourceService.getResources().subscribe({
      next: (resources) => {
        this.resources = resources;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error cargando recursos:', error);
      }
    });
  }

  get filteredResources(): SubjectResource[] {
    if (!this.searchTerm.trim()) {
      return this.resources;
    }
    const term = this.searchTerm.toLowerCase();
    return this.resources.filter(r => 
      r.name.toLowerCase().includes(term) || 
      (r.description?.toLowerCase().includes(term) ?? false)
    );
  }

  // Modal methods
  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetNewResource();
  }

  resetNewResource(): void {
    this.newResource = {
      name: '',
      type: 'PDF',
      url: '',
      description: ''
    };
  }

  saveResource(): void {
    // Validar campos requeridos
    if (!this.newResource.name || !this.newResource.url) {
      alert('Por favor, completa los campos obligatorios: Nombre y URL');
      return;
    }

    this.resourceService.createResource(this.newResource).subscribe({
      next: (createdResource) => {
        console.log('✅ Recurso creado:', createdResource);
        this.closeModal();
        this.loadResources(); // Recargar la lista completa
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error creando recurso:', error);
        alert('Error al crear el recurso. Por favor, intenta de nuevo.');
      }
    });
  }

  deleteResource(id: string): void {
    if (!confirm('¿Estás seguro de que quieres eliminar este recurso?')) {
      return;
    }

    this.resourceService.deleteResource(id).subscribe({
      next: () => {
        console.log('✅ Recurso eliminado');
        this.resources = this.resources.filter(r => r._id !== id);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error eliminando recurso:', error);
      }
    });
  }

  openResource(url: string): void {
    console.log('📖 Abriendo recurso:', url);
    window.open(url, '_blank');
  }
}
