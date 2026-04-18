import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <span class="logo">🍄</span>
          <h2>Crear Cuenta</h2>
          <p>Únete a la familia Sabina</p>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" [(ngModel)]="nombre" placeholder="Tu nombre">
          </div>
          <div class="form-group">
            <label>Apellido</label>
            <input type="text" [(ngModel)]="apellido" placeholder="Tu apellido">
          </div>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" placeholder="tu@email.com">
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" [(ngModel)]="password" placeholder="Mínimo 6 caracteres">
        </div>
        <div class="form-group">
          <label>Teléfono (opcional)</label>
          <input type="tel" [(ngModel)]="telefono" placeholder="Tu teléfono">
        </div>

        <div class="error" *ngIf="error">{{ error }}</div>

        <button (click)="register()" class="btn-submit" [disabled]="loading">
          {{ loading ? 'Registrando...' : 'Crear Cuenta' }}
        </button>

        <p class="auth-footer">
          ¿Ya tienes cuenta? <a routerLink="/login">Inicia Sesión</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 70px);
      display: flex; align-items: center; justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, rgba(179, 136, 255, 0.08), rgba(255, 128, 171, 0.05));
    }
    .auth-card {
      width: 100%; max-width: 480px;
      background: rgba(15, 15, 30, 0.9);
      border: 1px solid rgba(179, 136, 255, 0.3);
      border-radius: 20px; padding: 2.5rem;
    }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .logo { font-size: 3rem; display: block; margin-bottom: 0.5rem; }
    .auth-header h2 { color: #eee; font-size: 1.5rem; margin-bottom: 0.3rem; }
    .auth-header p { color: #888; font-size: 0.9rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1.2rem; }
    .form-group label { display: block; color: #aaa; margin-bottom: 0.4rem; font-size: 0.9rem; }
    .form-group input {
      width: 100%; padding: 0.75rem 1rem;
      background: rgba(179, 136, 255, 0.08);
      border: 1px solid rgba(179, 136, 255, 0.3);
      border-radius: 10px; color: #eee; font-size: 0.95rem;
    }
    .form-group input::placeholder { color: #666; }
    .form-group input:focus { outline: none; border-color: #ff80ab; }
    .error {
      color: #e74c3c; margin-bottom: 1rem; padding: 0.7rem;
      background: rgba(231,76,60,0.1); border-radius: 8px; font-size: 0.9rem;
    }
    .btn-submit {
      width: 100%; padding: 0.85rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      border: none; border-radius: 12px;
      color: white; font-size: 1rem; font-weight: 600;
      cursor: pointer;
    }
    .btn-submit:disabled { opacity: 0.5; }
    .auth-footer { text-align: center; margin-top: 1.5rem; color: #888; font-size: 0.9rem; }
    .auth-footer a { color: #ff80ab; text-decoration: none; }
  `]
})
export class RegisterComponent {
  nombre = '';
  apellido = '';
  email = '';
  password = '';
  telefono = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (!this.nombre || !this.apellido || !this.email || !this.password) {
      this.error = 'Completa todos los campos requeridos.';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }
    this.loading = true;
    this.error = '';

    this.authService.register({
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      password: this.password,
      telefono: this.telefono
    }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error = err.error?.message || 'Error al registrarse.';
        this.loading = false;
      }
    });
  }
}
