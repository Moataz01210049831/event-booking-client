import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login';
import { EventsListComponent } from './features/events/events-list/events-list';
import { EventDetailsComponent } from './features/events/event-details/event-details';

export const routes: Routes = [
  { path: '', component: EventsListComponent },
   { path: 'events/:id', component: EventDetailsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent }
];
