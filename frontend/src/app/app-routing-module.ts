import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Home } from './components/home/home';
import { Missions } from './components/missions/missions';
import { Grimoire } from './components/grimoire/grimoire';
import { Calendar } from './components/calendar/calendar';
import { Chat } from './components/chat/chat';
import { Pomodoro } from './components/pomodoro/pomodoro';
import { Profile } from './components/profile/profile';
import { Settings } from './components/settings/settings';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: Home
      },
      {
        path: 'missions',
        component: Missions
      },
      {
        path: 'grimoire',
        component: Grimoire
      },
      {
        path: 'calendar',
        component: Calendar
      },
      {
        path: 'chat',
        component: Chat
      },
      {
        path: 'pomodoro',
        component: Pomodoro
      },
      {
        path: 'profile',
        component: Profile
      },
      {
        path: 'settings',
        component: Settings
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
