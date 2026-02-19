import { Component, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ChatService } from '../../services/chat.service';

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
  
  newMessage = '';
  messages: Message[] = [
    {
      id: 1,
      content: '¡Hola! 👋 Soy tu Sensei IA. Estoy aquí para ayudarte con tus estudios, organización y motivación. ¿En qué puedo asistirte hoy?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ];

  private shouldScroll = false;

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) {}

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
    const messageToSend = this.newMessage;
    this.newMessage = '';
    this.shouldScroll = true;

    // Llamar al servicio de Gemini AI
    this.chatService.sendMessage(messageToSend).subscribe({
      next: (response) => {
        const aiResponse: Message = {
          id: this.messages.length + 1,
          content: response.reply,
          sender: 'ai',
          timestamp: new Date(),
          type: 'text'
        };
        this.messages.push(aiResponse);
        this.shouldScroll = true;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al comunicarse con Sensei IA:', error);
        const errorMessage: Message = {
          id: this.messages.length + 1,
          content: '¡Ups! 😅 Estoy teniendo problemas técnicos. Intenta de nuevo en un momento.',
          sender: 'ai',
          timestamp: new Date(),
          type: 'text'
        };
        this.messages.push(errorMessage);
        this.shouldScroll = true;
        this.cdr.detectChanges();
      }
    });
  }

  selectOption(option: string): void {
    this.newMessage = option;
    this.sendMessage();
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
