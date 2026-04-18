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
          <img src="assets/logo.png" alt="Sabina" class="logo-img">
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
            <h3 class="footer-logo"><img src="assets/logo.png" alt="Sabina" class="footer-logo-img"> Sabina</h3>
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
      background: rgba(15, 15, 30, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(179, 136, 255, 0.3);
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
    .logo-img { height: 40px; width: auto; border-radius: 50%; }
    .logo-text {
      background: linear-gradient(135deg, #b388ff, #ff80ab);
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
      color: #ff80ab;
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
      border: 1px solid #b388ff;
      border-radius: 25px;
      color: #b388ff;
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.3s;
    }
    .btn-outline:hover {
      background: #b388ff;
      color: white;
    }
    .btn-primary {
      padding: 0.5rem 1.2rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
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
      background: linear-gradient(135deg, #b388ff, #ff80ab);
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
      background: #14142a;
      border: 1px solid rgba(179, 136, 255, 0.3);
      border-radius: 12px;
      padding: 0.5rem 0;
      min-width: 200px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .dropdown-name {
      display: block;
      padding: 0.7rem 1rem;
      color: #ff80ab;
      font-weight: 600;
      border-bottom: 1px solid rgba(179, 136, 255, 0.2);
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
      background: rgba(179, 136, 255, 0.1);
      color: #ff80ab;
    }
    .main-content { min-height: calc(100vh - 70px - 300px); }
    .footer {
      background: #0a0a14;
      border-top: 1px solid rgba(179, 136, 255, 0.2);
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
    .footer-logo { display: flex; align-items: center; gap: 0.5rem; }
    .footer-logo-img { height: 30px; width: auto; border-radius: 50%; }
    .footer-grid h3 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .footer-grid h4 {
      color: #ff80ab;
      margin-bottom: 0.8rem;
    }
    .footer-grid p { color: #888; line-height: 1.6; }
    .footer-grid a {
      display: block;
      color: #888;
      text-decoration: none;
      margin-bottom: 0.4rem;
    }
    .footer-grid a:hover { color: #ff80ab; }
    .footer-bottom {
      border-top: 1px solid rgba(179, 136, 255, 0.15);
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
