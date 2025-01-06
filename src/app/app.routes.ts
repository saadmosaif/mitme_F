import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirect the root path to the login page
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Lazy-load the LoginComponent
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },

  // Lazy-load the RegisterComponent
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },

  // Lazy-load the MeetingComponent (Meeting Dashboard)
  {
    path: 'meeting',
    loadComponent: () =>
      import('./meeting/meeting.component').then((m) => m.MeetingComponent),
  },

  // Lazy-load the MeetingListComponent (List of meetings)
  {
    path: 'meeting/list',
    loadComponent: () =>
      import('./meeting/meeting-list/meeting-list.component').then(
        (m) => m.MeetingListComponent
      ),
  },

  // Lazy-load the MeetingDetailsComponent (Details of a specific meeting)
  {
    path: 'meeting/:id',
    loadComponent: () =>
      import('./meeting/meeting-details/meeting-details.component').then(
        (m) => m.MeetingDetailsComponent
      ),
  },

  // Lazy-load the VideoCallComponent
  {
    path: 'video-call',
    loadComponent: () =>
      import('./video-call/video-call.component').then((m) => m.VideoCallComponent),
  },

  // Lazy-load the ChatComponent
  {
    path: 'chat',
    loadComponent: () =>
      import('./chat/chat.component').then((m) => m.ChatComponent),
  },

  // Handle undefined routes with a wildcard route
  {
    path: '**',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
];
