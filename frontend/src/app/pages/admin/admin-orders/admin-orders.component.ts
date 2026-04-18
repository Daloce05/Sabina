import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-section">
      <h1>Gestionar Pedidos</h1>

      <div class="filter-bar">
        <select [(ngModel)]="filterEstado" (change)="loadOrders()">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmado">Confirmado</option>
          <option value="enviado">Enviado</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <div *ngFor="let order of orders" class="order-card">
        <div class="order-header">
          <div class="order-meta">
            <span class="order-id">#{{ order.id }}</span>
            <span class="order-date">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
            <span class="order-user">{{ order.usuario?.nombre }} {{ order.usuario?.apellido }} ({{ order.usuario?.email }})</span>
          </div>
          <div class="order-status">
            <select [(ngModel)]="order.estado" (change)="updateStatus(order.id, order.estado)" class="status-select" [class]="'status-' + order.estado">
              <option value="pendiente">Pendiente</option>
              <option value="confirmado">Confirmado</option>
              <option value="enviado">Enviado</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
        <div class="order-items">
          <div *ngFor="let item of order.items" class="order-item">
            <span>{{ item.producto?.nombre }} x{{ item.cantidad }}</span>
            <span>\${{ item.subtotal }}</span>
          </div>
        </div>
        <div class="order-footer">
          <span class="order-address">📍 {{ order.direccionEnvio }}</span>
          <span class="order-total">Total: \${{ order.total }}</span>
        </div>
      </div>

      <div *ngIf="orders.length === 0" class="empty">No hay pedidos</div>
    </div>
  `,
  styles: [`
    .admin-section h1 {
      color: #2d2d3f; margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .filter-bar { margin-bottom: 1.5rem; }
    .filter-bar select {
      padding: 0.6rem 1rem;
      background: #ffffff;
      border: 1px solid rgba(179,136,255,0.2);
      border-radius: 10px; color: #333;
      box-shadow: 0 1px 4px rgba(179,136,255,0.06);
    }
    .filter-bar select:focus { outline: none; border-color: #b388ff; }
    .filter-bar select option { background: #ffffff; }
    .order-card {
      background: #ffffff;
      border: 1px solid rgba(179,136,255,0.12);
      border-radius: 16px; margin-bottom: 1.5rem; overflow: hidden;
      box-shadow: 0 2px 8px rgba(179,136,255,0.06);
    }
    .order-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1rem 1.5rem;
      background: rgba(179,136,255,0.03);
      border-bottom: 1px solid rgba(179,136,255,0.08);
    }
    .order-id { color: #9c5cff; font-weight: 700; margin-right: 1rem; }
    .order-date { color: #888; font-size: 0.85rem; margin-right: 1rem; }
    .order-user { color: #666; font-size: 0.85rem; }
    .status-select {
      padding: 0.4rem 0.8rem; border-radius: 8px; border: none;
      font-size: 0.85rem; cursor: pointer; font-weight: 600;
    }
    .status-pendiente { background: rgba(243,156,18,0.12); color: #e67e22; }
    .status-confirmado { background: rgba(52,152,219,0.12); color: #2980b9; }
    .status-enviado { background: rgba(179,136,255,0.12); color: #9c5cff; }
    .status-entregado { background: rgba(46,204,113,0.12); color: #27ae60; }
    .status-cancelado { background: rgba(231,76,60,0.12); color: #c0392b; }
    .order-items { padding: 1rem 1.5rem; }
    .order-item {
      display: flex; justify-content: space-between;
      padding: 0.4rem 0; color: #666; font-size: 0.9rem;
    }
    .order-footer {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1rem 1.5rem;
      border-top: 1px solid rgba(179,136,255,0.08);
    }
    .order-address { color: #888; font-size: 0.85rem; }
    .order-total { color: #ff80ab; font-weight: 700; font-size: 1.1rem; }
    .empty { text-align: center; padding: 3rem; color: #888; }
  `]
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  filterEstado = '';

  constructor(private orderService: OrderService) {}

  ngOnInit() { this.loadOrders(); }

  loadOrders() {
    const params: any = {};
    if (this.filterEstado) params.estado = this.filterEstado;
    this.orderService.getAdminOrders(params).subscribe(res => {
      this.orders = res.data.orders;
    });
  }

  updateStatus(id: number, estado: string) {
    this.orderService.updateOrderStatus(id, estado).subscribe();
  }
}
