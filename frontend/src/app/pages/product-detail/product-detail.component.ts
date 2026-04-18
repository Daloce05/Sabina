import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { WhatsappService } from '../../services/whatsapp.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail-page" *ngIf="product">
      <div class="container">
        <a routerLink="/productos" class="back-link">&larr; Volver a productos</a>
        <div class="detail-grid">
          <div class="detail-img">
            <img *ngIf="product.imagen" [src]="'http://localhost:3000' + product.imagen" [alt]="product.nombre">
            <div *ngIf="!product.imagen" class="placeholder">🍄</div>
          </div>
          <div class="detail-info">
            <span class="category-tag">{{ product.categoria?.nombre }}</span>
            <h1>{{ product.nombre }}</h1>
            <p class="price">\${{ product.precio }}</p>
            <p class="description">{{ product.descripcion }}</p>
            <div class="stock-info">
              <span [class]="product.stock > 0 ? 'in-stock' : 'out-stock'">
                {{ product.stock > 0 ? 'En stock (' + product.stock + ' disponibles)' : 'Sin stock' }}
              </span>
            </div>
            <div class="quantity-row">
              <button (click)="quantity > 1 && quantity = quantity - 1" class="qty-btn">-</button>
              <span class="qty">{{ quantity }}</span>
              <button (click)="quantity < product.stock && quantity = quantity + 1" class="qty-btn">+</button>
            </div>
            <button class="btn-add-lg" (click)="contactWhatsApp()" [disabled]="product.stock === 0">
              {{ product.stock > 0 ? 'Consultar por WhatsApp 💬' : 'Sin Stock' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-page { padding: 2rem 1.5rem; }
    .container { max-width: 1000px; margin: 0 auto; }
    .back-link {
      color: #9b59b6; text-decoration: none; font-size: 0.95rem;
      display: inline-block; margin-bottom: 2rem;
    }
    .back-link:hover { color: #e84393; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
    .detail-img {
      border-radius: 16px; overflow: hidden;
      background: linear-gradient(135deg, rgba(155, 89, 182, 0.2), rgba(232, 67, 147, 0.1));
      display: flex; align-items: center; justify-content: center; min-height: 400px;
    }
    .detail-img img { width: 100%; height: 100%; object-fit: cover; }
    .placeholder { font-size: 6rem; }
    .category-tag {
      color: #e84393; font-size: 0.85rem; font-weight: 600;
      text-transform: uppercase; letter-spacing: 1px;
    }
    .detail-info h1 { color: #eee; font-size: 1.8rem; margin: 0.5rem 0; }
    .price {
      font-size: 2rem; font-weight: 700; margin: 0.5rem 0;
      background: linear-gradient(135deg, #9b59b6, #e84393);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .description { color: #aaa; line-height: 1.7; margin: 1rem 0; }
    .stock-info { margin: 1rem 0; }
    .in-stock { color: #2ecc71; }
    .out-stock { color: #e74c3c; }
    .quantity-row {
      display: flex; align-items: center; gap: 1rem; margin: 1.5rem 0;
    }
    .qty-btn {
      width: 40px; height: 40px;
      border-radius: 50%;
      border: 1px solid rgba(155, 89, 182, 0.3);
      background: rgba(155, 89, 182, 0.1);
      color: #eee; font-size: 1.2rem;
      cursor: pointer;
    }
    .qty { color: #eee; font-size: 1.2rem; font-weight: 600; min-width: 30px; text-align: center; }
    .btn-add-lg {
      width: 100%; padding: 1rem;
      background: linear-gradient(135deg, #9b59b6, #e84393);
      border: none; border-radius: 12px;
      color: white; font-size: 1.1rem; font-weight: 600;
      cursor: pointer; transition: opacity 0.3s;
    }
    .btn-add-lg:hover { opacity: 0.9; }
    .btn-add-lg:disabled { opacity: 0.4; cursor: not-allowed; }
  `]
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private whatsappService: WhatsappService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.productService.getProduct(id).subscribe(res => {
      this.product = res.data;
    });
  }

  contactWhatsApp() {
    this.whatsappService.sendProductMessage(this.product, this.quantity);
  }
}
