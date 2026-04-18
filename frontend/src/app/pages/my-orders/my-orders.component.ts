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
      background: linear-gradient(135deg, #9b59b6, #e84393);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .empty { text-align: center; padding: 3rem; color: #888; font-size: 1.2rem; }
    .order-card {
      background: rgba(155, 89, 182, 0.08);
      border: 1px solid rgba(155, 89, 182, 0.2);
      border-radius: 16px; margin-bottom: 1.5rem; overflow: hidden;
    }
    .order-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1rem 1.5rem;
      background: rgba(155, 89, 182, 0.05);
      border-bottom: 1px solid rgba(155, 89, 182, 0.1);
    }
    .order-id { color: #eee; font-weight: 600; margin-right: 1rem; }
    .order-date { color: #888; font-size: 0.85rem; }
    .status {
      padding: 0.3rem 0.8rem; border-radius: 20px;
      font-size: 0.8rem; font-weight: 600;
    }
    .status-pendiente { background: rgba(243,156,18,0.2); color: #f39c12; }
    .status-confirmado { background: rgba(52,152,219,0.2); color: #3498db; }
    .status-enviado { background: rgba(155,89,182,0.2); color: #9b59b6; }
    .status-entregado { background: rgba(46,204,113,0.2); color: #2ecc71; }
    .status-cancelado { background: rgba(231,76,60,0.2); color: #e74c3c; }
    .order-items { padding: 1rem 1.5rem; }
    .order-item {
      display: flex; justify-content: space-between;
      padding: 0.5rem 0; color: #aaa; font-size: 0.9rem;
      border-bottom: 1px solid rgba(155, 89, 182, 0.05);
    }
    .order-footer {
      padding: 1rem 1.5rem; text-align: right;
      border-top: 1px solid rgba(155, 89, 182, 0.1);
    }
    .order-total { color: #e84393; font-size: 1.1rem; font-weight: 700; }
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
