import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../modals/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'auth_token';

  // Signal بيحمل بيانات اليوزر الحالي (null لو مش عامل login)
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

  private setSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    this.currentUser.set(response);
  }

  private loadUserFromStorage(): void {
    const token = this.getToken();
    if (token) {
      // مبدئيًا بنحتفظ بالتوكن بس، هنحسّنها بعدين لو احتجنا نفك التوكن (decode)
      // ونجيب بيانات اليوزر منه عشان الصفحة لما تتعمل refresh
    }
  }

  hasRole(role: string): boolean {
  const roles = this.currentUser()?.roles ?? [];
  return roles.includes(role);
}
}