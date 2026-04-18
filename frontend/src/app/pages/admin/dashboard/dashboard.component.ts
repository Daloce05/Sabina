import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../../services/contact.service';
import { ProductService } from '../../../services/product.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <h1>Dashboard — Sabina Fungi</h1>

      <div class="stats-grid">
        <div class="stat-card highlight">
          <div class="stat-icon">💬</div>
          <div class="stat-info">
            <span class="stat-value">{{ contactStats.totalClics }}</span>
            <span class="stat-label">Consultas Totales</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-info">
            <span class="stat-value">{{ contactStats.clicsHoy }}</span>
            <span class="stat-label">Consultas Hoy</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📆</div>
          <div class="stat-info">
            <span class="stat-value">{{ contactStats.clicsSemana }}</span>
            <span class="stat-label">Esta Semana</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <span class="stat-value">{{ contactStats.clicsMes }}</span>
            <span class="stat-label">Este Mes</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <span class="stat-value">{{ totalProductos }}</span>
            <span class="stat-label">Productos</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <span class="stat-value">{{ totalUsuarios }}</span>
            <span class="stat-label">Usuarios</span>
          </div>
        </div>
      </div>

      <!-- Consultas por método -->
      <div class="section-row">
        <div class="section-card">
          <h2>📱 Consultas por Método</h2>
          <div *ngIf="contactStats.porMetodo.length === 0" class="empty">Sin datos aún</div>
          <div class="method-list">
            <div *ngFor="let m of contactStats.porMetodo" class="method-item">
              <div class="method-info">
                <span class="method-icon">{{ getMethodIcon(m.metodo) }}</span>
                <span class="method-name">{{ getMethodLabel(m.metodo) }}</span>
              </div>
              <div class="method-bar-container">
                <div class="method-bar" [style.width.%]="getBarWidth(m.total)"></div>
              </div>
              <span class="method-count">{{ m.total }}</span>
            </div>
          </div>
        </div>

        <div class="section-card">
          <h2>🍄 Productos Más Consultados</h2>
          <div *ngIf="contactStats.productosTop.length === 0" class="empty">Sin datos aún</div>
          <div class="product-list">
            <div *ngFor="let p of contactStats.productosTop; let i = index" class="product-item">
              <span class="product-rank">{{ i + 1 }}</span>
              <span class="product-name">{{ p.productName }}</span>
              <span class="product-count">{{ p.total }} consultas</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Últimos 7 días -->
      <div class="section-card" *ngIf="contactStats.porDia.length > 0">
        <h2>📈 Consultas Últimos 7 Días</h2>
        <div class="days-grid">
          <div *ngFor="let d of contactStats.porDia" class="day-item">
            <div class="day-bar" [style.height.%]="getDayBarHeight(d.total)"></div>
            <span class="day-count">{{ d.total }}</span>
            <span class="day-label">{{ formatDate(d.fecha) }}</span>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div class="actions-grid">
          <a routerLink="/admin/productos" class="action-card">
            <span>📦</span> Productos
          </a>
          <a routerLink="/admin/categorias" class="action-card">
            <span>🏷️</span> Categorías
          </a>
          <a routerLink="/admin/usuarios" class="action-card">
            <span>👥</span> Usuarios
          </a>
          <a routerLink="/admin/configuracion" class="action-card">
            <span>⚙️</span> Configuración
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard h1 {
      color: #eee; margin-bottom: 2rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.2rem; margin-bottom: 2rem;
    }
    .stat-card {
      background: rgba(179, 136, 255, 0.08);
      border: 1px solid rgba(179, 136, 255, 0.2);
      border-radius: 16px; padding: 1.3rem;
      display: flex; align-items: center; gap: 1rem;
    }
    .stat-card.highlight {
      background: rgba(179, 136, 255, 0.15);
      border-color: rgba(179, 136, 255, 0.4);
    }
    .stat-icon { font-size: 2rem; }
    .stat-value { display: block; font-size: 1.5rem; font-weight: 700; color: #eee; }
    .stat-label { color: #888; font-size: 0.8rem; }

    .section-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;
    }
    .section-card {
      background: rgba(179, 136, 255, 0.08);
      border: 1px solid rgba(179, 136, 255, 0.2);
      border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem;
    }
    .section-card h2 { color: #eee; font-size: 1.1rem; margin-bottom: 1.2rem; }
    .empty { color: #666; font-size: 0.9rem; text-align: center; padding: 1rem; }

    .method-list { display: flex; flex-direction: column; gap: 0.8rem; }
    .method-item { display: flex; align-items: center; gap: 0.8rem; }
    .method-info { display: flex; align-items: center; gap: 0.5rem; min-width: 110px; }
    .method-icon { font-size: 1.2rem; }
    .method-name { color: #ccc; font-size: 0.9rem; }
    .method-bar-container {
      flex: 1; height: 8px; background: rgba(179, 136, 255, 0.1);
      border-radius: 4px; overflow: hidden;
    }
    .method-bar {
      height: 100%;
      background: linear-gradient(90deg, #b388ff, #ff80ab);
      border-radius: 4px; min-width: 4px;
    }
    .method-count { color: #eee; font-weight: 600; font-size: 0.9rem; min-width: 30px; text-align: right; }

    .product-list { display: flex; flex-direction: column; gap: 0.6rem; }
    .product-item {
      display: flex; align-items: center; gap: 0.8rem;
      padding: 0.5rem 0.8rem;
      background: rgba(179, 136, 255, 0.05);
      border-radius: 8px;
    }
    .product-rank {
      width: 24px; height: 24px; border-radius: 50%;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
    }
    .product-name { flex: 1; color: #ccc; font-size: 0.9rem; }
    .product-count { color: #888; font-size: 0.8rem; white-space: nowrap; }

    .days-grid {
      display: flex; align-items: flex-end; gap: 0.8rem; height: 150px;
      padding-top: 1rem;
    }
    .day-item {
      flex: 1; display: flex; flex-direction: column; align-items: center;
      justify-content: flex-end; height: 100%;
    }
    .day-bar {
      width: 100%; min-height: 4px;
      background: linear-gradient(180deg, #b388ff, #ff80ab);
      border-radius: 4px 4px 0 0;
    }
    .day-count { color: #eee; font-size: 0.8rem; font-weight: 600; margin-top: 0.3rem; }
    .day-label { color: #666; font-size: 0.7rem; margin-top: 0.2rem; }

    .quick-actions h2 { color: #eee; margin-bottom: 1rem; }
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem;
    }
    .action-card {
      background: rgba(179, 136, 255, 0.08);
      border: 1px solid rgba(179, 136, 255, 0.2);
      border-radius: 12px; padding: 1.3rem;
      color: #ddd; text-decoration: none;
      text-align: center; font-size: 0.95rem;
      transition: all 0.3s;
    }
    .action-card span { display: block; font-size: 1.8rem; margin-bottom: 0.4rem; }
    .action-card:hover {
      border-color: #ff80ab;
      transform: translateY(-3px);
      box-shadow: 0 5px 20px rgba(179, 136, 255, 0.2);
    }

    @media (max-width: 768px) {
      .section-row { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  contactStats: any = {
    totalClics: 0, clicsHoy: 0, clicsSemana: 0, clicsMes: 0,
    porMetodo: [], productosTop: [], porDia: []
  };
  totalProductos = 0;
  totalUsuarios = 0;
  private maxMethodCount = 0;
  private maxDayCount = 0;

  constructor(
    private contactService: ContactService,
    private productService: ProductService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.contactService.getStats().subscribe({
      next: (res) => {
        this.contactStats = res.data;
        this.maxMethodCount = Math.max(...(res.data.porMetodo?.map((m: any) => m.total) || [1]));
        this.maxDayCount = Math.max(...(res.data.porDia?.map((d: any) => d.total) || [1]));
      },
      error: () => {}
    });

    this.productService.getAdminProducts({ limit: 1 }).subscribe({
      next: (res) => this.totalProductos = res.data.total,
      error: () => {}
    });

    this.userService.getUsers().subscribe({
      next: (res: any) => this.totalUsuarios = res.data?.length || 0,
      error: () => {}
    });
  }

  getMethodIcon(metodo: string): string {
    const icons: any = { whatsapp: '💬', telefono: '📞', email: '📧', instagram: '📸' };
    return icons[metodo] || '📱';
  }

  getMethodLabel(metodo: string): string {
    const labels: any = { whatsapp: 'WhatsApp', telefono: 'Teléfono', email: 'Email', instagram: 'Instagram' };
    return labels[metodo] || metodo;
  }

  getBarWidth(total: number): number {
    return this.maxMethodCount ? (total / this.maxMethodCount) * 100 : 0;
  }

  getDayBarHeight(total: number): number {
    return this.maxDayCount ? (total / this.maxDayCount) * 100 : 10;
  }

  formatDate(fecha: string): string {
    const d = new Date(fecha + 'T00:00:00');
    return d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric' });
  }
}
