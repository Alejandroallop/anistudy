import { Component, ViewChild, ChangeDetectorRef, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.scss']
})
export class Calendar implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @ViewChild('modalOverlay') modalOverlay!: ElementRef;

  // Configuración de FullCalendar
  calendarOptions: CalendarOptions = {};

  // Modal state
  isModalOpen: boolean = false;

  // Form data
  newTitle: string = '';
  newDate: string = '';
  newType: 'exam' | 'delivery' | 'class' = 'exam';

  // Inyectar ChangeDetectorRef
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    // Configurar calendarOptions en ngOnInit
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locale: 'es',

      // 🔥 OCULTAR HEADER POR DEFECTO (usamos controles personalizados)
      headerToolbar: false,

      buttonText: {
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        day: 'Día'
      },
      firstDay: 1, // Lunes como primer día
      height: 'auto',
      fixedWeekCount: false,

      // Eventos mock definidos aquí
      events: this.getInitialEvents(),

      // Handlers
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),

      // Estilo de eventos
      eventDisplay: 'block',
      displayEventTime: false
    };

    // 🔥 FORZAR DETECCIÓN DE CAMBIOS - Elimina el error NG0100
    this.cd.detectChanges();
  }

  ngAfterViewInit() {
    // 🔍 LOG: Verificar que el calendario se ha inicializado
    console.log('📅 ngAfterViewInit - Verificando inicialización del calendario');
    console.log('🔍 Estado de calendarComponent:', this.calendarComponent);

    if (this.calendarComponent) {
      console.log('✅ FullCalendar component encontrado correctamente');
    } else {
      console.error('❌ ERROR: calendarComponent es undefined o null');
    }

    // 🚀 MOVER EL MODAL AL BODY PARA ESCAPAR DEL STACKING CONTEXT
    if (this.modalOverlay && this.modalOverlay.nativeElement) {
      console.log('📦 Moviendo modal al <body>...');
      document.body.appendChild(this.modalOverlay.nativeElement);
      console.log('✅ Modal movido al <body> exitosamente');
    }
  }

  ngOnDestroy() {
    // 🧹 LIMPIAR: Remover el modal del body al destruir el componente
    if (this.modalOverlay && this.modalOverlay.nativeElement && this.modalOverlay.nativeElement.parentNode) {
      console.log('🧹 Removiendo modal del <body>...');
      this.modalOverlay.nativeElement.parentNode.removeChild(this.modalOverlay.nativeElement);
    }
  }

  /**
   * Datos mock de eventos iniciales
   */
  private getInitialEvents() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const inThreeDays = new Date(today);
    inThreeDays.setDate(inThreeDays.getDate() + 3);

    const thisWeekend = new Date(today);
    thisWeekend.setDate(thisWeekend.getDate() + (6 - thisWeekend.getDay()));

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const nextWeek2 = new Date(today);
    nextWeek2.setDate(nextWeek2.getDate() + 10);

    return [
      {
        id: '1',
        title: '📚 Examen de Matemáticas',
        start: tomorrow.toISOString().split('T')[0],
        backgroundColor: '#FF477E',
        borderColor: '#FF477E',
        textColor: '#FFFFFF',
        classNames: ['event-exam']
      },
      {
        id: '2',
        title: '💻 Entrega Proyecto Java',
        start: inThreeDays.toISOString().split('T')[0],
        backgroundColor: '#4A90E2',
        borderColor: '#4A90E2',
        textColor: '#FFFFFF',
        classNames: ['event-delivery']
      },
      {
        id: '3',
        title: '🇯🇵 Clase de Japonés',
        start: thisWeekend.toISOString().split('T')[0],
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        textColor: '#FFFFFF',
        classNames: ['event-class']
      },
      {
        id: '4',
        title: '📝 Entrega Ensayo Historia',
        start: nextWeek.toISOString().split('T')[0],
        backgroundColor: '#8B5CF6',
        borderColor: '#8B5CF6',
        textColor: '#FFFFFF',
        classNames: ['event-delivery']
      },
      {
        id: '5',
        title: '🔬 Examen de Biología',
        start: nextWeek2.toISOString().split('T')[0],
        backgroundColor: '#FF477E',
        borderColor: '#FF477E',
        textColor: '#FFFFFF',
        classNames: ['event-exam']
      }
    ];
  }

  /**
   * Abre el modal para crear evento
   */
  openModal() {
    console.log('✅ openModal() llamado - abriendo modal');
    this.isModalOpen = true;
    // Establecer fecha de hoy como default
    const today = new Date().toISOString().split('T')[0];
    this.newDate = today;
    console.log('✅ isModalOpen ahora es:', this.isModalOpen);
    console.log('✅ Fecha establecida:', this.newDate);

    // ¡LA LÍNEA MÁGICA! Fuerza la actualización de la vista
    // FullCalendar ejecuta callbacks fuera de NgZone
    this.cd.detectChanges();
  }

  /**
   * Cierra el modal y limpia el formulario
   */
  closeModal() {
    console.log('❌ closeModal() llamado');
    this.isModalOpen = false;
    this.newTitle = '';
    this.newDate = '';
    this.newType = 'exam';

    // Forzar actualización de la vista
    this.cd.detectChanges();
  }

  /**
   * Añade un nuevo evento al calendario
   */
  addEvent() {
    console.log('🎯 addEvent() llamado con:', {
      title: this.newTitle,
      date: this.newDate,
      type: this.newType
    });

    // Validación
    if (!this.newTitle.trim() || !this.newDate) {
      console.log('⚠️ Validación fallida - campos vacíos');
      alert('Por favor completa el título y la fecha');
      return;
    }

    // Determinar color según tipo
    let backgroundColor = '#FF477E'; // Default: Examen (Rosa)
    let emoji = '📚';

    switch (this.newType) {
      case 'exam':
        backgroundColor = '#FF477E'; // Rosa
        emoji = '📚';
        break;
      case 'delivery':
        backgroundColor = '#4A90E2'; // Azul
        emoji = '💻';
        break;
      case 'class':
        backgroundColor = '#10B981'; // Verde
        emoji = '🇯🇵';
        break;
    }

    console.log('🎨 Color seleccionado:', backgroundColor, 'Emoji:', emoji);

    // Crear evento usando la API de FullCalendar (evita ExpressionChangedError)
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.addEvent({
      title: `${emoji} ${this.newTitle}`,
      start: this.newDate,
      backgroundColor: backgroundColor,
      borderColor: backgroundColor,
      textColor: '#FFFFFF',
      allDay: true
    });

    console.log('✅ Evento añadido al calendario');

    // Cerrar modal y limpiar
    this.closeModal();
  }

  /**
   * Maneja el click en una fecha
   */
  handleDateClick(arg: DateClickArg) {
    console.log('📅 Click en fecha detectado:', arg.dateStr);
    // Abrir modal con la fecha seleccionada
    this.newDate = arg.dateStr;
    this.openModal();
  }

  /**
   * Maneja el click en un evento
   */
  handleEventClick(arg: EventClickArg) {
    console.log('📌 Click en evento detectado:', arg.event.title);
    const confirmDelete = confirm(`${arg.event.title}\nFecha: ${arg.event.startStr}\n\n¿Eliminar este evento?`);

    if (confirmDelete) {
      arg.event.remove();
      console.log('🗑️ Evento eliminado');
    }
  }

  /**
   * CUSTOM NAVIGATION CONTROLS
   */

  /**
   * Navega al mes anterior
   */
  handlePrev() {
    console.log('⬅️ 1. Botón Anterior pulsado');
    console.log('🔍 2. Estado del componente calendario:', this.calendarComponent);

    if (this.calendarComponent) {
      console.log('✅ 3. API encontrada, intentando mover al mes anterior...');
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.prev();
      this.cd.detectChanges(); // Force title update
      console.log('✅ 4. Navegación completada. Nuevo mes:', calendarApi.view.title);
    } else {
      console.error('❌ ERROR CRÍTICO: No encuentro la referencia #calendar. ¿Está bien puesta en el HTML?');
    }
  }

  /**
   * Navega al mes siguiente
   */
  handleNext() {
    console.log('➡️ 1. Botón Siguiente pulsado');
    console.log('🔍 2. Estado del componente calendario:', this.calendarComponent);

    if (this.calendarComponent) {
      console.log('✅ 3. API encontrada, intentando mover al mes siguiente...');
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.next();
      this.cd.detectChanges(); // Force title update
      console.log('✅ 4. Navegación completada. Nuevo mes:', calendarApi.view.title);
    } else {
      console.error('❌ ERROR CRÍTICO: No encuentro la referencia #calendar. ¿Está bien puesta en el HTML?');
    }
  }

  /**
   * Navega a la fecha actual
   */
  handleToday() {
    console.log('🎯 1. Botón Hoy pulsado');
    console.log('🔍 2. Estado del componente calendario:', this.calendarComponent);

    if (this.calendarComponent) {
      console.log('✅ 3. API encontrada, intentando volver a hoy...');
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.today();
      this.cd.detectChanges(); // Force title update
      console.log('✅ 4. Navegación completada. Mes actual:', calendarApi.view.title);
    } else {
      console.error('❌ ERROR CRÍTICO: No encuentro la referencia #calendar. ¿Está bien puesta en el HTML?');
    }
  }

  /**
   * Obtiene el título del calendario actual (Mes Año)
   */
  get calendarTitle(): string {
    if (!this.calendarComponent) return '';
    const calendarApi = this.calendarComponent.getApi();
    return calendarApi.view.title;
  }

  /**
   * Obtiene los próximos 3 eventos ordenados por fecha
   */
  get upcomingEvents() {
    if (!this.calendarComponent) return [];

    const calendarApi = this.calendarComponent.getApi();
    const allEvents = calendarApi.getEvents();
    const today = new Date();

    return allEvents
      .filter(event => event.start && event.start >= today)
      .sort((a, b) => {
        const dateA = a.start ? a.start.getTime() : 0;
        const dateB = b.start ? b.start.getTime() : 0;
        return dateA - dateB;
      })
      .slice(0, 3)
      .map(event => ({
        title: event.title || '',
        start: event.startStr,
        backgroundColor: event.backgroundColor || '#FF477E'
      }));
  }

  /**
   * Formatea una fecha para mostrar
   */
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    };
    return date.toLocaleDateString('es-ES', options);
  }
}
