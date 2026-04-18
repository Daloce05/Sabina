import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <img src="assets/logo.png" alt="Sabina" class="logo-img">
          <span class="logo-text">Sabina Admin</span>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <span class="nav-icon">📊</span> Dashboard
          </a>
          <a routerLink="/admin/productos" routerLinkActive="active">
            <span class="nav-icon">📦</span> Productos
          </a>
          <a routerLink="/admin/categorias" routerLinkActive="active">
            <span class="nav-icon">🏷️</span> Categorías
          </a>
          <a routerLink="/admin/pedidos" routerLinkActive="active">
            <span class="nav-icon">🛒</span> Pedidos
          </a>
          <a routerLink="/admin/usuarios" routerLinkActive="active">
            <span class="nav-icon">👥</span> Usuarios
          </a>
          <div class="sidebar-divider"></div>
          <a routerLink="/">
            <span class="nav-icon">🏪</span> Ver Tienda
          </a>
          <button class="logout-btn" (click)="logout()">
            <span class="nav-icon">🚪</span> Cerrar Sesión
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="admin-main">
        <header class="admin-header">
          <h2>Panel de Administración</h2>
          <div class="admin-user">
            <span>{{ authService.currentUser?.nombre }} {{ authService.currentUser?.apellido }}</span>
            <div class="user-avatar">{{ authService.currentUser?.nombre?.charAt(0) }}</div>
          </div>
        </header>
        <div class="admin-content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      min-height: 100vh;
    }
    .sidebar {
      width: 260px;
      background: linear-gradient(180deg, #14142a 0%, #0a0a14 100%);
      border-right: 1px solid rgba(179, 136, 255, 0.2);
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      overflow-y: auto;
    }
    .sidebar-header {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.7rem;
      border-bottom: 1px solid rgba(179, 136, 255, 0.2);
    }
    .logo-img { height: 36px; width: auto; border-radius: 50%; }
    .logo-text {
      font-size: 1.2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .sidebar-nav {
      padding: 1rem 0;
    }
    .sidebar-nav a, .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.8rem 1.5rem;
      color: #aaa;
      text-decoration: none;
      font-size: 0.95rem;
      transition: all 0.3s;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
    }
    .sidebar-nav a:hover, .sidebar-nav a.active, .logout-btn:hover {
      color: white;
      background: rgba(179, 136, 255, 0.15);
      border-right: 3px solid #ff80ab;
    }
    .sidebar-divider {
      height: 1px;
      background: rgba(179, 136, 255, 0.15);
      margin: 0.8rem 1.5rem;
    }
    .nav-icon { font-size: 1.1rem; }
    .admin-main {
      flex: 1;
      margin-left: 260px;
      background: #0a0a14;
    }
    .admin-header {
      background: rgba(15, 15, 30, 0.95);
      border-bottom: 1px solid rgba(179, 136, 255, 0.2);
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .admin-header h2 {
      font-size: 1.2rem;
      color: #ddd;
    }
    .admin-user {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      color: #aaa;
      font-size: 0.9rem;
    }
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
    .admin-content {
      padding: 2rem;
    }
  `]
})
export class AdminLayoutComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
