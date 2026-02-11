import { Component } from '@angular/core';

interface SubjectResource {
  id: number;
  name: string;
  type: 'PDF' | 'Link' | 'Video';
  icon: string;
  description: string;
  url: string;
}

@Component({
  selector: 'app-grimoire',
  standalone: false,
  templateUrl: './grimoire.html',
  styleUrls: ['./grimoire.scss']
})
export class Grimoire {
  searchTerm: string = '';

  resources: SubjectResource[] = [
    {
      id: 1,
      name: 'Fórmulas de Álgebra',
      type: 'PDF',
      icon: 'pi pi-file-pdf',
      description: 'Compendio de fórmulas algebraicas fundamentales para resolver ecuaciones cuadráticas y sistemas lineales.',
      url: 'https://es.wikipedia.org/wiki/Álgebra'
    },
    {
      id: 2,
      name: 'Clase Grabada: Revolución Francesa',
      type: 'Video',
      icon: 'pi pi-video',
      description: 'Sesión completa sobre los eventos históricos que desencadenaron la Revolución Francesa de 1789.',
      url: 'https://www.youtube.com/watch?v=ttdq818TGD0'
    },
    {
      id: 3,
      name: 'Vocabulario Japonés JLPT5',
      type: 'Link',
      icon: 'pi pi-link',
      description: 'Lista interactiva de 800+ palabras esenciales para el examen de certificación JLPT nivel N5.',
      url: 'https://jisho.org/'
    },
    {
      id: 4,
      name: 'Apuntes de Física: Cinemática',
      type: 'PDF',
      icon: 'pi pi-file-pdf',
      description: 'Teoría y ejercicios resueltos sobre movimiento rectilíneo uniforme y acelerado.',
      url: 'https://es.wikipedia.org/wiki/Cinemática'
    },
    {
      id: 5,
      name: 'Tutorial: Arrays en JavaScript',
      type: 'Video',
      icon: 'pi pi-video',
      description: 'Video tutorial explicando métodos de arrays: map, filter, reduce y forEach con ejemplos prácticos.',
      url: 'https://developer.mozilla.org/es/docs/Web/JavaScript'
    },
    {
      id: 6,
      name: 'Guía de Gramática Inglesa',
      type: 'Link',
      icon: 'pi pi-link',
      description: 'Recurso online completo sobre tiempos verbales, condicionales y estructura de oraciones.',
      url: 'https://www.wordreference.com/es/'
    }
  ];

  get filteredResources(): SubjectResource[] {
    if (!this.searchTerm.trim()) {
      return this.resources;
    }
    const term = this.searchTerm.toLowerCase();
    return this.resources.filter(r => 
      r.name.toLowerCase().includes(term) || 
      r.description.toLowerCase().includes(term)
    );
  }

  openResource(url: string): void {
    console.log('📖 Abriendo recurso:', url);
    window.open(url, '_blank');
  }
}
