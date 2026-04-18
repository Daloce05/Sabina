import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { WhatsappService } from '../../services/whatsapp.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="logo">
          <span class="logo-icon">🍄</span>
          <span class="logo-text">Sabina</span>
        </a>

        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Inicio</a>
          <a routerLink="/productos" routerLinkActive="active">Productos</a>
        </div>

        <div class="nav-actions">
          <a (click)="contactWhatsApp()" class="whatsapp-btn" title="Contáctanos por WhatsApp">
            💬
          </a>

          <ng-container *ngIf="!authService.isLoggedIn">
            <a routerLink="/login" class="btn-outline">Iniciar Sesión</a>
            <a routerLink="/registro" class="btn-primary">Registrarse</a>
          </ng-container>

          <ng-container *ngIf="authService.isLoggedIn">
            <div class="user-menu">
              <button class="user-btn" (click)="toggleMenu()">
                {{ authService.currentUser?.nombre?.charAt(0) }}{{ authService.currentUser?.apellido?.charAt(0) }}
              </button>
              <div class="dropdown" *ngIf="menuOpen">
                <span class="dropdown-name">{{ authService.currentUser?.nombre }} {{ authService.currentUser?.apellido }}</span>
                <a routerLink="/mis-pedidos" (click)="menuOpen = false">Mis Pedidos</a>
                <a routerLink="/admin" *ngIf="authService.isAdmin" (click)="menuOpen = false">Panel Admin</a>
                <button (click)="logout()">Cerrar Sesión</button>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-grid">
          <div>
            <h3>🍄 Sabina</h3>
            <p>Especialistas en hongos y sus derivados. Productos naturales de la más alta calidad.</p>
          </div>
          <div>
            <h4>Enlaces</h4>
            <a routerLink="/">Inicio</a>
            <a routerLink="/productos">Productos</a>
          </div>
          <div>
            <h4>Contacto</h4>
            <p>info&#64;sabina.com</p>
            <p>+1 234 567 890</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 Sabina Ecommerce. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .navbar {
      background: rgba(20, 10, 30, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(155, 89, 182, 0.3);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: 700;
    }
    .logo-icon { font-size: 1.8rem; }
    .logo-text {
      background: linear-gradient(135deg, #9b59b6, #e84393);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .nav-links {
      display: flex;
      gap: 2rem;
    }
    .nav-links a {
      color: #ccc;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }
    .nav-links a:hover, .nav-links a.active {
      color: #e84393;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .whatsapp-btn {
      font-size: 1.4rem;
      text-decoration: none;
      cursor: pointer;
      transition: transform 0.3s;
    }
    .whatsapp-btn:hover {
      transform: scale(1.2);
    }
    .btn-outline {
      padding: 0.5rem 1.2rem;
      border: 1px solid #9b59b6;
      border-radius: 25px;
      color: #9b59b6;
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.3s;
    }
    .btn-outline:hover {
      background: #9b59b6;
      color: white;
    }
    .btn-primary {
      padding: 0.5rem 1.2rem;
      background: linear-gradient(135deg, #9b59b6, #e84393);
      border-radius: 25px;
      color: white;
      text-decoration: none;
      font-size: 0.9rem;
      transition: opacity 0.3s;
    }
    .btn-primary:hover { opacity: 0.9; }
    .user-menu { position: relative; }
    .user-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #9b59b6, #e84393);
      color: white;
      border: none;
      cursor: pointer;
      font-weight: bold;
      font-size: 0.85rem;
    }
    .dropdown {
      position: absolute;
      top: 50px;
      right: 0;
      background: #1a0a2e;
      border: 1px solid rgba(155, 89, 182, 0.3);
      border-radius: 12px;
      padding: 0.5rem 0;
      min-width: 200px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .dropdown-name {
      display: block;
      padding: 0.7rem 1rem;
      color: #e84393;
      font-weight: 600;
      border-bottom: 1px solid rgba(155, 89, 182, 0.2);
    }
    .dropdown a, .dropdown button {
      display: block;
      width: 100%;
      padding: 0.7rem 1rem;
      color: #ccc;
      text-decoration: none;
      text-align: left;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
    }
    .dropdown a:hover, .dropdown button:hover {
      background: rgba(155, 89, 182, 0.1);
      color: #e84393;
    }
    .main-content { min-height: calc(100vh - 70px - 300px); }
    .footer {
      background: #0d0517;
      border-top: 1px solid rgba(155, 89, 182, 0.2);
      padding: 3rem 0 1.5rem;
    }
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .footer-grid h3 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #9b59b6, #e84393);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .footer-grid h4 {
      color: #e84393;
      margin-bottom: 0.8rem;
    }
    .footer-grid p { color: #888; line-height: 1.6; }
    .footer-grid a {
      display: block;
      color: #888;
      text-decoration: none;
      margin-bottom: 0.4rem;
    }
    .footer-grid a:hover { color: #e84393; }
    .footer-bottom {
      border-top: 1px solid rgba(155, 89, 182, 0.15);
      padding-top: 1.5rem;
      text-align: center;
      color: #666;
      font-size: 0.85rem;
    }
  `]
})
export class PublicLayoutComponent {
  menuOpen = false;

  constructor(
    public authService: AuthService,
    private whatsappService: WhatsappService,
    private router: Router
  ) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  contactWhatsApp() {
    this.whatsappService.sendGeneralMessage();
  }

  logout() {
    this.authService.logout();
    this.menuOpen = false;
    this.router.navigate(['/']);
  }
}
