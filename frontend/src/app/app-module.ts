import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Home } from './components/home/home';
import { Missions } from './components/missions/missions';
import { Grimoire } from './components/grimoire/grimoire';
import { Settings } from './components/settings/settings';
import { Calendar } from './components/calendar/calendar';
import { Chat } from './components/chat/chat';
import { Pomodoro } from './components/pomodoro/pomodoro';
import { Profile } from './components/profile/profile';

@NgModule({
  declarations: [
    App,
    Login,
    Dashboard,
    Home,
    Missions,
    Grimoire,
    Settings,
    Calendar,
    Chat,
    Pomodoro,
    Profile
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // ✅ Necesario para PrimeNG
    ReactiveFormsModule, // ✅ Para formularios reactivos
    FormsModule, // ✅ Para ngModel (two-way binding)
    AppRoutingModule,
    FullCalendarModule, // ✅ FullCalendar
    // PrimeNG Modules
    InputTextModule,
    PasswordModule,
    ButtonModule
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }