import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="checkout-page">
      <div class="container">
        <h1 class="page-title">Finalizar Compra</h1>

        <div *ngIf="cartService.items.length === 0" class="empty">
          <p>No hay productos en el carrito</p>
          <a routerLink="/productos" class="btn-primary">Ver Productos</a>
        </div>

        <div *ngIf="cartService.items.length > 0" class="checkout-grid">
          <div class="checkout-form">
            <h3>Datos de Envío</h3>
            <div class="form-group">
              <label>Dirección de Envío</label>
              <textarea [(ngModel)]="direccionEnvio" placeholder="Ingresa tu dirección completa" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input type="tel" [(ngModel)]="telefono" placeholder="Tu número de teléfono">
            </div>
            <div class="form-group">
              <label>Notas (opcional)</label>
              <textarea [(ngModel)]="notas" placeholder="Instrucciones especiales..." rows="2"></textarea>
            </div>

            <div class="error" *ngIf="error">{{ error }}</div>
            <div class="success" *ngIf="success">{{ success }}</div>

            <button (click)="placeOrder()" class="btn-order" [disabled]="loading">
              {{ loading ? 'Procesando...' : 'Confirmar Pedido' }}
            </button>
          </div>

          <div class="order-summary">
            <h3>Resumen del Pedido</h3>
            <div *ngFor="let item of cartService.items" class="summary-item">
              <span>{{ item.product.nombre }} x{{ item.cantidad }}</span>
              <span>\${{ (item.product.precio * item.cantidad).toFixed(2) }}</span>
            </div>
            <div class="summary-total">
              <span>Total</span>
              <span>\${{ cartService.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page { padding: 2rem 1.5rem; }
    .container { max-width: 900px; margin: 0 auto; }
    .page-title {
      font-size: 2rem; margin-bottom: 2rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .empty { text-align: center; padding: 3rem; color: #888; }
    .btn-primary {
      display: inline-block; margin-top: 1rem; padding: 0.7rem 2rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      border-radius: 25px; color: white; text-decoration: none;
    }
    .checkout-grid { display: grid; grid-template-columns: 1fr 350px; gap: 2rem; }
    .checkout-form {
      background: rgba(179, 136, 255, 0.08);
      border: 1px solid rgba(179, 136, 255, 0.2);
      border-radius: 16px; padding: 2rem;
    }
    .checkout-form h3 { color: #eee; margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1.2rem; }
    .form-group label {
      display: block; color: #aaa; margin-bottom: 0.4rem; font-size: 0.9rem;
    }
    .form-group input, .form-group textarea {
      width: 100%; padding: 0.7rem 1rem;
      background: rgba(15, 15, 30, 0.8);
      border: 1px solid rgba(179, 136, 255, 0.3);
      border-radius: 8px; color: #eee; font-size: 0.95rem;
      font-family: inherit; resize: vertical;
    }
    .error { color: #e74c3c; margin-bottom: 1rem; padding: 0.7rem; background: rgba(231,76,60,0.1); border-radius: 8px; }
    .success { color: #2ecc71; margin-bottom: 1rem; padding: 0.7rem; background: rgba(46,204,113,0.1); border-radius: 8px; }
    .btn-order {
      width: 100%; padding: 0.9rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      border: none; border-radius: 12px;
      color: white; font-size: 1.05rem; font-weight: 600;
      cursor: pointer;
    }
    .btn-order:disabled { opacity: 0.5; cursor: not-allowed; }
    .order-summary {
      background: rgba(179, 136, 255, 0.08);
      border: 1px solid rgba(179, 136, 255, 0.2);
      border-radius: 16px; padding: 1.5rem;
      height: fit-content; position: sticky; top: 90px;
    }
    .order-summary h3 { color: #eee; margin-bottom: 1rem; }
    .summary-item {
      display: flex; justify-content: space-between;
      padding: 0.6rem 0; color: #aaa; font-size: 0.9rem;
      border-bottom: 1px solid rgba(179, 136, 255, 0.1);
    }
    .summary-total {
      display: flex; justify-content: space-between;
      padding: 1rem 0 0; color: #eee; font-size: 1.2rem; font-weight: 700;
    }
  `]
})
export class CheckoutComponent {
  direccionEnvio = '';
  telefono = '';
  notas = '';
  loading = false;
  error = '';
  success = '';

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.currentUser) {
      this.direccionEnvio = this.authService.currentUser.direccion || '';
      this.telefono = this.authService.currentUser.telefono || '';
    }
  }

  placeOrder() {
    if (!this.direccionEnvio.trim()) {
      this.error = 'La dirección de envío es requerida.';
      return;
    }

    this.loading = true;
    this.error = '';

    const orderData = {
      items: this.cartService.items.map(i => ({
        productId: i.product.id,
        cantidad: i.cantidad
      })),
      direccionEnvio: this.direccionEnvio,
      telefono: this.telefono,
      notas: this.notas
    };

    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        this.success = '¡Pedido realizado exitosamente!';
        this.cartService.clearCart();
        setTimeout(() => this.router.navigate(['/mis-pedidos']), 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al crear el pedido.';
        this.loading = false;
      }
    });
  }
}
