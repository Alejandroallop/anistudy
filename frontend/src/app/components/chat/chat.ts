import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'options';
  options?: string[];
}

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss']
})
export class Chat implements AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  
  newMessage: string = '';
  messages: Message[] = [
    {
      id: 1,
      content: '¡Hola! 👋 Veo que tienes un examen de historia pronto. ¿Quieres repasar los conceptos clave de la Revolución Francesa hoy?',
      sender: 'ai',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text'
    },
    {
      id: 2,
      content: 'Sí, por favor, Sensei. Tengo dudas sobre las causas principales. 😓',
      sender: 'user',
      timestamp: new Date(Date.now() - 3000000),
      type: 'text'
    },
    {
      id: 3,
      content: `¡Entendido! Vamos a desglosarlo como si fuera una misión RPG. 🛡️

Las causas se dividen en tres grandes grupos:

• **Económicas:** Malas cosechas y gastos excesivos de la corte.

• **Sociales:** Desigualdad entre los tres estados.

• **Ideológicas:** La influencia de la Ilustración.

¿Cuál de estas te gustaría explorar primero?`,
      sender: 'ai',
      timestamp: new Date(Date.now() - 2400000),
      type: 'options',
      options: ['💰 Causas Económicas', '⚖️ Desigualdad Social']
    }
  ];

  private shouldScroll = false;

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) {
      return;
    }

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: this.messages.length + 1,
      content: this.newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    this.messages.push(userMessage);
    this.newMessage = '';
    this.shouldScroll = true;

    // Simular respuesta de la IA después de 2 segundos
    setTimeout(() => {
      const aiResponse: Message = {
        id: this.messages.length + 1,
        content: '¡Interesante pregunta! Déjame buscar en mi base de datos mágica... 📚✨ Te responderé con más detalles en un momento.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      this.messages.push(aiResponse);
      this.shouldScroll = true;
    }, 2000);
  }

  selectOption(option: string): void {
    // Simular clic en una opción
    const userMessage: Message = {
      id: this.messages.length + 1,
      content: option,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    this.messages.push(userMessage);
    this.shouldScroll = true;

    // Respuesta automática de la IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: this.messages.length + 1,
        content: `¡Excelente elección! Vamos a profundizar en: ${option}. Te prepararé un resumen detallado...`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      this.messages.push(aiResponse);
      this.shouldScroll = true;
    }, 1500);
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error al hacer scroll:', err);
    }
  }

  formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }
}
