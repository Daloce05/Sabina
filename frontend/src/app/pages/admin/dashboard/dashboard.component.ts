import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <span class="stat-value">\${{ stats.totalVentas | number:'1.2-2' }}</span>
            <span class="stat-label">Ventas Totales</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalOrdenes }}</span>
            <span class="stat-label">Total Pedidos</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.ordenesPendientes }}</span>
            <span class="stat-label">Pedidos Pendientes</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalUsuarios }}</span>
            <span class="stat-label">Total Clientes</span>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div class="actions-grid">
          <a routerLink="/admin/productos" class="action-card">
            <span>📦</span> Gestionar Productos
          </a>
          <a routerLink="/admin/categorias" class="action-card">
            <span>🏷️</span> Gestionar Categorías
          </a>
          <a routerLink="/admin/pedidos" class="action-card">
            <span>🛒</span> Ver Pedidos
          </a>
          <a routerLink="/admin/usuarios" class="action-card">
            <span>👥</span> Gestionar Usuarios
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard h1 {
      color: #eee; margin-bottom: 2rem;
      background: linear-gradient(135deg, #9b59b6, #e84393);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.5rem; margin-bottom: 3rem;
    }
    .stat-card {
      background: rgba(155, 89, 182, 0.08);
      border: 1px solid rgba(155, 89, 182, 0.2);
      border-radius: 16px; padding: 1.5rem;
      display: flex; align-items: center; gap: 1rem;
    }
    .stat-icon { font-size: 2.5rem; }
    .stat-value {
      display: block; font-size: 1.5rem; font-weight: 700; color: #eee;
    }
    .stat-label { color: #888; font-size: 0.85rem; }
    .quick-actions h2 { color: #eee; margin-bottom: 1.5rem; }
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    .action-card {
      background: rgba(155, 89, 182, 0.08);
      border: 1px solid rgba(155, 89, 182, 0.2);
      border-radius: 12px; padding: 1.5rem;
      color: #ddd; text-decoration: none;
      text-align: center; font-size: 1rem;
      transition: all 0.3s;
    }
    .action-card span { display: block; font-size: 2rem; margin-bottom: 0.5rem; }
    .action-card:hover {
      border-color: #e84393;
      transform: translateY(-3px);
      box-shadow: 0 5px 20px rgba(155, 89, 182, 0.2);
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats = { totalVentas: 0, totalOrdenes: 0, ordenesPendientes: 0, totalUsuarios: 0 };

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getStats().subscribe(res => {
      this.stats = res.data;
    });
  }
}
