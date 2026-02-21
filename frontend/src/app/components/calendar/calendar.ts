import { Component, ViewChild, ChangeDetectorRef, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventService, CalendarEvent } from '../../services/event.service';

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
  isModalOpen = false;

  // Form data
  newTitle = '';
  newDate = '';
  newType: 'exam' | 'delivery' | 'class' = 'exam';

  constructor(
    private cd: ChangeDetectorRef,
    private eventService: EventService
  ) { }

  ngOnInit() {
    // Configurar calendarOptions en ngOnInit
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locale: 'es',

      // Ocultar header por defecto (usamos controles personalizados)
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

      // Eventos se cargarán dinámicamente desde la BD
      events: [],

      // Handlers
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),

      // Estilo de eventos
      eventDisplay: 'block',
      displayEventTime: false
    };

    // Cargar eventos desde la base de datos
    this.loadEvents();

    // Forzar detección de cambios para evitar el error NG0100
    this.cd.detectChanges();
  }

  ngAfterViewInit() {
    // Mover el modal al body para escapar del stacking context de CSS
    if (this.modalOverlay && this.modalOverlay.nativeElement) {
      document.body.appendChild(this.modalOverlay.nativeElement);
    }
  }

  ngOnDestroy() {
    // Limpiar: remover el modal del body al destruir el componente
    if (this.modalOverlay && this.modalOverlay.nativeElement && this.modalOverlay.nativeElement.parentNode) {
      this.modalOverlay.nativeElement.parentNode.removeChild(this.modalOverlay.nativeElement);
    }
  }

  /**
   * Carga eventos desde la base de datos y los mapea al formato de FullCalendar
   */
  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        const mappedEvents: EventInput[] = events.map(event => {
          let backgroundColor = '#FF477E';
          let emoji = '📚';

          // Asignar color y emoji según el tipo
          switch (event.type) {
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

          return {
            id: event._id,
            title: `${emoji} ${event.title}`,
            start: typeof event.start === 'string' ? event.start : event.start.toISOString().split('T')[0],
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            textColor: '#FFFFFF',
            extendedProps: {
              _id: event._id,
              type: event.type
            }
          };
        });

        this.calendarOptions.events = mappedEvents;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error cargando eventos:', error);
      }
    });
  }

  /**
   * Abre el modal para crear un nuevo evento
   */
  openModal(dateStr?: string) {
    this.isModalOpen = true;
    // Si se recibe una fecha, usarla; si no, usar la fecha de hoy
    this.newDate = dateStr ?? new Date().toISOString().split('T')[0];

    // Forzar la actualización de la vista (FullCalendar ejecuta callbacks fuera de NgZone)
    this.cd.detectChanges();
  }

  /**
   * Cierra el modal y limpia el formulario
   */
  closeModal() {
    this.isModalOpen = false;
    this.newTitle = '';
    this.newDate = '';
    this.newType = 'exam';

    this.cd.detectChanges();
  }

  /**
   * Añade un nuevo evento al calendario guardándolo en la BD
   */
  addEvent() {
    if (!this.newTitle.trim() || !this.newDate) {
      alert('Por favor completa el título y la fecha');
      return;
    }

    const newEvent: CalendarEvent = {
      title: this.newTitle,
      type: this.newType,
      start: this.newDate,
      allDay: true
    };

    this.eventService.createEvent(newEvent).subscribe({
      next: () => {
        this.loadEvents();
        this.closeModal();
      },
      error: (error) => {
        console.error('❌ Error creando evento:', error);
        alert('Error al crear el evento. Por favor, intenta de nuevo.');
      }
    });
  }

  /**
   * Abre el modal con la fecha clickeada preseleccionada
   */
  handleDateClick(arg: DateClickArg) {
    this.openModal(arg.dateStr);
  }

  /**
   * Muestra un diálogo de confirmación para eliminar el evento clickeado
   */
  handleEventClick(arg: EventClickArg) {
    const confirmDelete = confirm(`${arg.event.title}\nFecha: ${arg.event.startStr}\n\n¿Eliminar este evento?`);

    if (confirmDelete) {
      const eventId = arg.event.extendedProps['_id'] || arg.event.id;

      if (!eventId) {
        console.error('❌ Error: evento sin ID');
        alert('Error: no se puede eliminar el evento');
        return;
      }

      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          arg.event.remove();
        },
        error: (error) => {
          console.error('❌ Error eliminando evento:', error);
          alert('Error al eliminar el evento');
        }
      });
    }
  }

  /**
   * CUSTOM NAVIGATION CONTROLS
   */

  /**
   * Navega al mes anterior
   */
  handlePrev() {
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.prev();
      this.cd.detectChanges();
    } else {
      console.error('❌ Error crítico: referencia #calendar no encontrada');
    }
  }

  /**
   * Navega al mes siguiente
   */
  handleNext() {
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.next();
      this.cd.detectChanges();
    } else {
      console.error('❌ Error crítico: referencia #calendar no encontrada');
    }
  }

  /**
   * Navega a la fecha actual
   */
  handleToday() {
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.today();
      this.cd.detectChanges();
    } else {
      console.error('❌ Error crítico: referencia #calendar no encontrada');
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
   * Formatea una fecha para mostrar en la lista de próximos eventos
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
