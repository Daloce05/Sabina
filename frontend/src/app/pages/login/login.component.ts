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
      background: linear-gradient(135deg, rgba(179, 136, 255, 0.06), rgba(255, 128, 171, 0.03));
    }
    .auth-card {
      width: 100%; max-width: 420px;
      background: #ffffff;
      border: 1px solid rgba(179, 136, 255, 0.15);
      border-radius: 20px; padding: 2.5rem;
      box-shadow: 0 4px 20px rgba(179, 136, 255, 0.08);
    }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .logo { font-size: 3rem; display: block; margin-bottom: 0.5rem; }
    .auth-header h2 {
      color: #2d2d3f; font-size: 1.5rem; margin-bottom: 0.3rem;
    }
    .auth-header p { color: #888; font-size: 0.9rem; }
    .form-group { margin-bottom: 1.2rem; }
    .form-group label { display: block; color: #666; margin-bottom: 0.4rem; font-size: 0.9rem; }
    .form-group input {
      width: 100%; padding: 0.75rem 1rem;
      background: #f9f7fc;
      border: 1px solid rgba(179, 136, 255, 0.2);
      border-radius: 10px; color: #333; font-size: 0.95rem;
    }
    .form-group input::placeholder { color: #aaa; }
    .form-group input:focus {
      outline: none; border-color: #b388ff;
    }
    .error {
      color: #e74c3c; margin-bottom: 1rem; padding: 0.7rem;
      background: rgba(231,76,60,0.08); border-radius: 8px; font-size: 0.9rem;
    }
    .btn-submit {
      width: 100%; padding: 0.85rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      border: none; border-radius: 12px;
      color: white; font-size: 1rem; font-weight: 600;
      cursor: pointer; transition: opacity 0.3s;
    }
    .btn-submit:hover { opacity: 0.9; }
    .btn-submit:disabled { opacity: 0.5; }
    .auth-footer {
      text-align: center; margin-top: 1.5rem; color: #888; font-size: 0.9rem;
    }
    .auth-footer a { color: #9c5cff; text-decoration: none; }
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
