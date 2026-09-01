import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAllowed = authService.hasRole('Admin') || authService.hasRole('Organizer');

  if (isAllowed) {
    return true;
  }

  router.navigate(['/']);
  return false;
};