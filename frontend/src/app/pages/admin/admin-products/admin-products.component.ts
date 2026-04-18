import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-section">
      <div class="section-header">
        <h1>Gestionar Productos</h1>
        <button (click)="showForm = !showForm; resetForm()" class="btn-new">
          {{ showForm ? 'Cancelar' : '+ Nuevo Producto' }}
        </button>
      </div>

      <!-- Form -->
      <div *ngIf="showForm" class="form-card">
        <h3>{{ editingId ? 'Editar' : 'Nuevo' }} Producto</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" [(ngModel)]="form.nombre" placeholder="Nombre del producto">
          </div>
          <div class="form-group">
            <label>Precio</label>
            <input type="number" [(ngModel)]="form.precio" placeholder="0.00" step="0.01">
          </div>
          <div class="form-group">
            <label>Stock</label>
            <input type="number" [(ngModel)]="form.stock" placeholder="0">
          </div>
          <div class="form-group">
            <label>Categoría</label>
            <select [(ngModel)]="form.categoryId">
              <option [ngValue]="null">Seleccionar...</option>
              <option *ngFor="let cat of categories" [ngValue]="cat.id">{{ cat.nombre }}</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <textarea [(ngModel)]="form.descripcion" rows="3" placeholder="Descripción del producto"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Imagen</label>
            <input type="file" (change)="onFileSelected($event)" accept="image/*">
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="form.destacado">
              Producto Destacado
            </label>
          </div>
        </div>
        <div class="error" *ngIf="error">{{ error }}</div>
        <button (click)="save()" class="btn-save">{{ editingId ? 'Actualizar' : 'Crear' }} Producto</button>
      </div>

      <!-- Search -->
      <div class="search-bar">
        <input type="text" [(ngModel)]="search" (input)="loadProducts()" placeholder="Buscar productos...">
      </div>

      <!-- Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Destacado</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of products">
              <td>{{ p.id }}</td>
              <td>{{ p.nombre }}</td>
              <td>{{ p.categoria?.nombre }}</td>
              <td>\${{ p.precio }}</td>
              <td>{{ p.stock }}</td>
              <td><span [class]="p.destacado ? 'badge-yes' : 'badge-no'">{{ p.destacado ? 'Sí' : 'No' }}</span></td>
              <td><span [class]="p.activo ? 'badge-yes' : 'badge-no'">{{ p.activo ? 'Sí' : 'No' }}</span></td>
              <td class="actions">
                <button (click)="edit(p)" class="btn-edit">✏️</button>
                <button (click)="delete(p.id)" class="btn-delete">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-section h1 {
      color: #2d2d3f;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .section-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
    }
    .btn-new {
      padding: 0.6rem 1.5rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      border: none; border-radius: 10px;
      color: white; cursor: pointer; font-weight: 600;
    }
    .form-card {
      background: #ffffff;
      border: 1px solid rgba(179, 136, 255, 0.12);
      border-radius: 16px; padding: 2rem; margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(179, 136, 255, 0.06);
    }
    .form-card h3 { color: #2d2d3f; margin-bottom: 1.5rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-row { display: flex; gap: 1rem; align-items: end; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; color: #666; margin-bottom: 0.3rem; font-size: 0.9rem; }
    .form-group input, .form-group textarea, .form-group select {
      width: 100%; padding: 0.65rem 0.8rem;
      background: #f9f7fc;
      border: 1px solid rgba(179, 136, 255, 0.2);
      border-radius: 8px; color: #333; font-family: inherit;
    }
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: #b388ff; }
    .form-group select option { background: #ffffff; }
    .checkbox-label {
      display: flex !important; align-items: center; gap: 0.5rem; cursor: pointer; color: #666 !important;
    }
    .error { color: #e74c3c; margin-bottom: 1rem; padding: 0.5rem; background: rgba(231,76,60,0.08); border-radius: 6px; }
    .btn-save {
      padding: 0.7rem 2rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      border: none; border-radius: 10px;
      color: white; cursor: pointer; font-weight: 600;
    }
    .search-bar { margin-bottom: 1.5rem; }
    .search-bar input {
      width: 100%; max-width: 400px; padding: 0.65rem 1rem;
      background: #ffffff;
      border: 1px solid rgba(179, 136, 255, 0.2);
      border-radius: 10px; color: #333;
      box-shadow: 0 1px 4px rgba(179, 136, 255, 0.06);
    }
    .search-bar input:focus { outline: none; border-color: #b388ff; }
    .search-bar input::placeholder { color: #aaa; }
    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(179, 136, 255, 0.06); }
    th {
      background: rgba(179, 136, 255, 0.06);
      color: #888; padding: 0.8rem; text-align: left; font-size: 0.85rem;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    td {
      padding: 0.8rem; color: #555; border-bottom: 1px solid rgba(179, 136, 255, 0.06);
      font-size: 0.9rem;
    }
    tr:hover { background: rgba(179, 136, 255, 0.03); }
    .badge-yes { color: #27ae60; background: rgba(46,204,113,0.1); padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem; }
    .badge-no { color: #c0392b; background: rgba(231,76,60,0.1); padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem; }
    .actions { display: flex; gap: 0.5rem; }
    .btn-edit, .btn-delete {
      background: none; border: none; cursor: pointer; font-size: 1.1rem; padding: 0.3rem;
    }
  `]
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  showForm = false;
  editingId: number | null = null;
  search = '';
  error = '';
  selectedFile: File | null = null;
  form = { nombre: '', descripcion: '', precio: 0, stock: 0, categoryId: null as number | null, destacado: false };

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadProducts();
    this.categoryService.getAdminCategories().subscribe(res => this.categories = res.data);
  }

  loadProducts() {
    this.productService.getAdminProducts({ search: this.search }).subscribe(res => {
      this.products = res.data.products;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  resetForm() {
    this.form = { nombre: '', descripcion: '', precio: 0, stock: 0, categoryId: null, destacado: false };
    this.editingId = null;
    this.selectedFile = null;
    this.error = '';
  }

  edit(p: Product) {
    this.editingId = p.id;
    this.form = { nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, stock: p.stock, categoryId: p.categoryId, destacado: p.destacado };
    this.showForm = true;
  }

  save() {
    if (!this.form.nombre || !this.form.categoryId) {
      this.error = 'Nombre y categoría son requeridos.';
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.form.nombre);
    formData.append('descripcion', this.form.descripcion);
    formData.append('precio', this.form.precio.toString());
    formData.append('stock', this.form.stock.toString());
    formData.append('categoryId', this.form.categoryId!.toString());
    formData.append('destacado', this.form.destacado.toString());
    if (this.selectedFile) formData.append('imagen', this.selectedFile);

    const req = this.editingId
      ? this.productService.updateProduct(this.editingId, formData)
      : this.productService.createProduct(formData);

    req.subscribe({
      next: () => { this.showForm = false; this.resetForm(); this.loadProducts(); },
      error: (err) => this.error = err.error?.message || 'Error al guardar.'
    });
  }

  delete(id: number) {
    if (confirm('¿Eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }
}
