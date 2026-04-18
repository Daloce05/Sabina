import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/order.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartKey = 'sabina_cart';
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);

  items$ = this.itemsSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const stored = localStorage.getItem(this.cartKey);
    if (stored) {
      try {
        this.itemsSubject.next(JSON.parse(stored));
      } catch {
        this.itemsSubject.next([]);
      }
    }
  }

  private saveCart(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.itemsSubject.value));
  }

  addToCart(product: Product, cantidad: number = 1): void {
    const items = [...this.itemsSubject.value];
    const existing = items.find(i => i.product.id === product.id);

    if (existing) {
      existing.cantidad += cantidad;
    } else {
      items.push({ product, cantidad });
    }

    this.itemsSubject.next(items);
    this.saveCart();
  }

  removeFromCart(productId: number): void {
    const items = this.itemsSubject.value.filter(i => i.product.id !== productId);
    this.itemsSubject.next(items);
    this.saveCart();
  }

  updateQuantity(productId: number, cantidad: number): void {
    const items = [...this.itemsSubject.value];
    const item = items.find(i => i.product.id === productId);
    if (item) {
      item.cantidad = cantidad;
      if (item.cantidad <= 0) {
        this.removeFromCart(productId);
        return;
      }
    }
    this.itemsSubject.next(items);
    this.saveCart();
  }

  clearCart(): void {
    this.itemsSubject.next([]);
    localStorage.removeItem(this.cartKey);
  }

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  get total(): number {
    return this.itemsSubject.value.reduce((sum, item) => sum + (item.product.precio * item.cantidad), 0);
  }

  get itemCount(): number {
    return this.itemsSubject.value.reduce((sum, item) => sum + item.cantidad, 0);
  }
}
