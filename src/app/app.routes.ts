import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login';
import { EventsListComponent } from './features/events/events-list/events-list';
import { EventDetailsComponent } from './features/events/event-details/event-details';
import { BookingSummaryComponent } from './features/bookings/booking-summary/booking-summary';
import { MyBookingsComponent } from './features/bookings/my-bookings/my-bookings';
import { AdminPanelComponent } from './features/admin/admin-panel/admin-panel';
import { adminGuard } from './core/Guards/role.guard';

export const routes: Routes = [
  { path: 'admin', component: AdminPanelComponent, canActivate: [adminGuard] },

  { path: '', component: EventsListComponent },
   { path: 'events/:id', component: EventDetailsComponent },
     { path: 'booking-summary', component: BookingSummaryComponent },
      { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent }
];
