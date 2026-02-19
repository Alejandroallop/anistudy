import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');

  ngOnInit(): void {
    // Restaurar Modo Oscuro al recargar la página
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-theme');
    }
  }
}
