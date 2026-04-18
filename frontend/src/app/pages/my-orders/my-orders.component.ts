import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orders-page">
      <div class="container">
        <h1 class="page-title">Mis Pedidos</h1>

        <div *ngIf="orders.length === 0" class="empty">
          <p>📦 No tienes pedidos aún</p>
        </div>

        <div *ngFor="let order of orders" class="order-card">
          <div class="order-header">
            <div>
              <span class="order-id">Pedido #{{ order.id }}</span>
              <span class="order-date">{{ order.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <span class="status" [class]="'status-' + order.estado">{{ order.estado | titlecase }}</span>
          </div>
          <div class="order-items">
            <div *ngFor="let item of order.items" class="order-item">
              <span>{{ item.producto?.nombre }} x{{ item.cantidad }}</span>
              <span>\${{ item.subtotal }}</span>
            </div>
          </div>
          <div class="order-footer">
            <span class="order-total">Total: \${{ order.total }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-page { padding: 2rem 1.5rem; }
    .container { max-width: 800px; margin: 0 auto; }
    .page-title {
      font-size: 2rem; margin-bottom: 2rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .empty { text-align: center; padding: 3rem; color: #888; font-size: 1.2rem; }
    .order-card {
      background: #ffffff;
      border: 1px solid rgba(179, 136, 255, 0.12);
      border-radius: 16px; margin-bottom: 1.5rem; overflow: hidden;
      box-shadow: 0 2px 8px rgba(179, 136, 255, 0.06);
    }
    .order-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1rem 1.5rem;
      background: rgba(179, 136, 255, 0.04);
      border-bottom: 1px solid rgba(179, 136, 255, 0.08);
    }
    .order-id { color: #2d2d3f; font-weight: 600; margin-right: 1rem; }
    .order-date { color: #888; font-size: 0.85rem; }
    .status {
      padding: 0.3rem 0.8rem; border-radius: 20px;
      font-size: 0.8rem; font-weight: 600;
    }
    .status-pendiente { background: rgba(243,156,18,0.12); color: #e67e22; }
    .status-confirmado { background: rgba(52,152,219,0.12); color: #2980b9; }
    .status-enviado { background: rgba(179,136,255,0.12); color: #9c5cff; }
    .status-entregado { background: rgba(46,204,113,0.12); color: #27ae60; }
    .status-cancelado { background: rgba(231,76,60,0.12); color: #c0392b; }
    .order-items { padding: 1rem 1.5rem; }
    .order-item {
      display: flex; justify-content: space-between;
      padding: 0.5rem 0; color: #666; font-size: 0.9rem;
      border-bottom: 1px solid rgba(179, 136, 255, 0.05);
    }
    .order-footer {
      padding: 1rem 1.5rem; text-align: right;
      border-top: 1px solid rgba(179, 136, 255, 0.08);
    }
    .order-total { color: #ff80ab; font-size: 1.1rem; font-weight: 700; }
  `]
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getMyOrders().subscribe(res => {
      this.orders = res.data;
    });
  }
}
