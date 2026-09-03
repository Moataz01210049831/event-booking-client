import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse, LoginRequest, RegisterRequest } from '../modals/auth.model';
import { environment } from '../../../environments/environment';

interface DecodedToken {
  sub: string;
  email: string;
  roles: string | string[];
  exp: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'auth_token';

  currentUser = signal<AuthResponse | null>(null);

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request)
      .pipe(tap(response => this.setSession(response)));
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(tap(response => this.setSession(response)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const roles = this.currentUser()?.roles ?? [];
    return roles.includes(role);
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    this.currentUser.set(response);
  }

  private loadUserFromStorage(): void {
    const token = this.getToken();
    if (!token) {
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        this.logout();
        return;
      }

      const nameClaim = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
        ?? decoded['name']
        ?? '';

      const roles = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles];

      this.currentUser.set({
        token,
        email: decoded.email,
        fullName: nameClaim,
        roles
      });
    } catch {
      this.logout();
    }
  }
}