import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <span class="logo">🍄</span>
          <h2>Iniciar Sesión</h2>
          <p>Bienvenido de vuelta a Sabina</p>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" placeholder="tu@email.com">
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" [(ngModel)]="password" placeholder="Tu contraseña">
        </div>

        <div class="error" *ngIf="error">{{ error }}</div>

        <button (click)="login()" class="btn-submit" [disabled]="loading">
          {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>

        <p class="auth-footer">
          ¿No tienes cuenta? <a routerLink="/registro">Regístrate</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 70px);
      display: flex; align-items: center; justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, rgba(155, 89, 182, 0.08), rgba(232, 67, 147, 0.05));
    }
    .auth-card {
      width: 100%; max-width: 420px;
      background: rgba(20, 10, 30, 0.9);
      border: 1px solid rgba(155, 89, 182, 0.3);
      border-radius: 20px; padding: 2.5rem;
    }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .logo { font-size: 3rem; display: block; margin-bottom: 0.5rem; }
    .auth-header h2 {
      color: #eee; font-size: 1.5rem; margin-bottom: 0.3rem;
    }
    .auth-header p { color: #888; font-size: 0.9rem; }
    .form-group { margin-bottom: 1.2rem; }
    .form-group label { display: block; color: #aaa; margin-bottom: 0.4rem; font-size: 0.9rem; }
    .form-group input {
      width: 100%; padding: 0.75rem 1rem;
      background: rgba(155, 89, 182, 0.08);
      border: 1px solid rgba(155, 89, 182, 0.3);
      border-radius: 10px; color: #eee; font-size: 0.95rem;
    }
    .form-group input::placeholder { color: #666; }
    .form-group input:focus {
      outline: none; border-color: #e84393;
    }
    .error {
      color: #e74c3c; margin-bottom: 1rem; padding: 0.7rem;
      background: rgba(231,76,60,0.1); border-radius: 8px; font-size: 0.9rem;
    }
    .btn-submit {
      width: 100%; padding: 0.85rem;
      background: linear-gradient(135deg, #9b59b6, #e84393);
      border: none; border-radius: 12px;
      color: white; font-size: 1rem; font-weight: 600;
      cursor: pointer; transition: opacity 0.3s;
    }
    .btn-submit:hover { opacity: 0.9; }
    .btn-submit:disabled { opacity: 0.5; }
    .auth-footer {
      text-align: center; margin-top: 1.5rem; color: #888; font-size: 0.9rem;
    }
    .auth-footer a { color: #e84393; text-decoration: none; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      this.error = 'Completa todos los campos.';
      return;
    }
    this.loading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.data.user.rol === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al iniciar sesión.';
        this.loading = false;
      }
    });
  }
}
