import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenKey = 'sabina_token';
  private userKey = 'sabina_user';

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.userKey);
    if (token && userStr) {
      try {
        this.currentUserSubject.next(JSON.parse(userStr));
      } catch {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.success) {
          localStorage.setItem(this.tokenKey, res.data.token);
          localStorage.setItem(this.userKey, JSON.stringify(res.data.user));
          this.currentUserSubject.next(res.data.user);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/registro`, data).pipe(
      tap(res => {
        if (res.success) {
          localStorage.setItem(this.tokenKey, res.data.token);
          localStorage.setItem(this.userKey, JSON.stringify(res.data.user));
          this.currentUserSubject.next(res.data.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.getToken();
  }

  get isAdmin(): boolean {
    return this.currentUser?.rol === 'admin';
  }

  updateProfile(data: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil`, data).pipe(
      tap((res: any) => {
        if (res.success) {
          localStorage.setItem(this.userKey, JSON.stringify(res.data));
          this.currentUserSubject.next(res.data);
        }
      })
    );
  }
}
