import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Import the guard

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'meeting',
    loadComponent: () =>
      import('./meeting/meeting.component').then((m) => m.MeetingComponent),
  },
  {
    path: 'meeting/list',
    loadComponent: () =>
      import('./meeting/meeting-list/meeting-list.component').then(
        (m) => m.MeetingListComponent
      ),
  },
  {
    path: 'meeting/:id',
    loadComponent: () =>
      import('./meeting/meeting-details/meeting-details.component').then(
        (m) => m.MeetingDetailsComponent
      ),
  },
  {
    path: 'video-call/:id',
    loadComponent: () =>
      import('./video-call/video-call.component').then(
        (m) => m.VideoCallComponent
      ),
  },
  
  {
    path: 'chat',
    loadComponent: () =>
      import('./chat/chat.component').then((m) => m.ChatComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
];
