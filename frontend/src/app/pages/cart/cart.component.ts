import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-page">
      <div class="container">
        <h1 class="page-title">Carrito de Compras</h1>

        <div *ngIf="cartService.items.length === 0" class="empty-cart">
          <p>🛒 Tu carrito está vacío</p>
          <a routerLink="/productos" class="btn-primary">Ver Productos</a>
        </div>

        <div *ngIf="cartService.items.length > 0" class="cart-content">
          <div class="cart-items">
            <div *ngFor="let item of cartService.items" class="cart-item">
              <div class="item-img">
                <img *ngIf="item.product.imagen" [src]="item.product.imagen.startsWith('http') ? item.product.imagen : 'https://sabina-utf1.onrender.com' + item.product.imagen" [alt]="item.product.nombre">
                <div *ngIf="!item.product.imagen" class="placeholder">🍄</div>
              </div>
              <div class="item-info">
                <h3>{{ item.product.nombre }}</h3>
                <span class="item-price">\${{ item.product.precio }}</span>
              </div>
              <div class="item-qty">
                <button (click)="updateQty(item.product.id, item.cantidad - 1)" class="qty-btn">-</button>
                <span>{{ item.cantidad }}</span>
                <button (click)="updateQty(item.product.id, item.cantidad + 1)" class="qty-btn">+</button>
              </div>
              <div class="item-subtotal">
                \${{ (item.product.precio * item.cantidad).toFixed(2) }}
              </div>
              <button (click)="remove(item.product.id)" class="remove-btn">✕</button>
            </div>
          </div>

          <div class="cart-summary">
            <h3>Resumen</h3>
            <div class="summary-row">
              <span>Subtotal</span>
              <span>\${{ cartService.total.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>\${{ cartService.total.toFixed(2) }}</span>
            </div>
            <a routerLink="/checkout" class="btn-checkout">Proceder al Pago</a>
            <button (click)="cartService.clearCart()" class="btn-clear">Vaciar Carrito</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-page { padding: 2rem 1.5rem; }
    .container { max-width: 1000px; margin: 0 auto; }
    .page-title {
      font-size: 2rem; color: #eee; margin-bottom: 2rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .empty-cart { text-align: center; padding: 4rem; color: #888; font-size: 1.2rem; }
    .btn-primary {
      display: inline-block; margin-top: 1rem;
      padding: 0.7rem 2rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      border-radius: 25px; color: white; text-decoration: none;
    }
    .cart-content { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; }
    .cart-item {
      display: flex; align-items: center; gap: 1rem;
      background: rgba(179, 136, 255, 0.08);
      border: 1px solid rgba(179, 136, 255, 0.2);
      border-radius: 12px; padding: 1rem;
      margin-bottom: 1rem;
    }
    .item-img {
      width: 80px; height: 80px; border-radius: 8px; overflow: hidden;
      background: rgba(179, 136, 255, 0.1);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .item-img img { width: 100%; height: 100%; object-fit: cover; }
    .placeholder { font-size: 2rem; }
    .item-info { flex: 1; }
    .item-info h3 { color: #eee; font-size: 0.95rem; margin-bottom: 0.3rem; }
    .item-price { color: #b388ff; font-weight: 600; }
    .item-qty { display: flex; align-items: center; gap: 0.5rem; }
    .qty-btn {
      width: 30px; height: 30px; border-radius: 50%;
      border: 1px solid rgba(179, 136, 255, 0.3);
      background: rgba(179, 136, 255, 0.1);
      color: #eee; cursor: pointer;
    }
    .item-qty span { color: #eee; min-width: 25px; text-align: center; }
    .item-subtotal { color: #ff80ab; font-weight: 700; min-width: 70px; text-align: right; }
    .remove-btn {
      background: none; border: none; color: #e74c3c;
      cursor: pointer; font-size: 1.1rem; padding: 0.5rem;
    }
    .cart-summary {
      background: rgba(179, 136, 255, 0.08);
      border: 1px solid rgba(179, 136, 255, 0.2);
      border-radius: 16px; padding: 1.5rem;
      position: sticky; top: 90px; height: fit-content;
    }
    .cart-summary h3 { color: #eee; margin-bottom: 1.5rem; }
    .summary-row {
      display: flex; justify-content: space-between;
      padding: 0.8rem 0;
      border-bottom: 1px solid rgba(179, 136, 255, 0.1);
      color: #aaa;
    }
    .summary-row.total {
      color: #eee; font-size: 1.2rem; font-weight: 700;
      border-bottom: none; margin-top: 0.5rem;
    }
    .btn-checkout {
      display: block; width: 100%; padding: 0.8rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      border-radius: 12px; color: white; text-align: center;
      text-decoration: none; font-weight: 600; margin-top: 1.5rem;
    }
    .btn-clear {
      display: block; width: 100%; padding: 0.6rem;
      background: none; border: 1px solid rgba(231, 76, 60, 0.5);
      border-radius: 8px; color: #e74c3c; cursor: pointer;
      margin-top: 0.7rem; font-size: 0.85rem;
    }
  `]
})
export class CartComponent {
  constructor(public cartService: CartService) {}

  updateQty(productId: number, qty: number) {
    this.cartService.updateQuantity(productId, qty);
  }

  remove(productId: number) {
    this.cartService.removeFromCart(productId);
  }
}
