import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';

import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./app/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./app/auth/register/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'meeting',
        loadComponent: () =>
          import('./app/meeting/meeting.component').then((m) => m.MeetingComponent),
      },
      { path: '**', redirectTo: 'login' }, // Wildcard route for undefined paths
    ]),
    importProvidersFrom(FormsModule), // Add FormsModule globally for ngModel
  ],
}).catch((err) => console.error(err));
