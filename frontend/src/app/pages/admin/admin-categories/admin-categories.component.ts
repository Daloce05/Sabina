import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-section">
      <div class="section-header">
        <h1>Gestionar Categorías</h1>
        <button (click)="showForm = !showForm; resetForm()" class="btn-new">
          {{ showForm ? 'Cancelar' : '+ Nueva Categoría' }}
        </button>
      </div>

      <div *ngIf="showForm" class="form-card">
        <h3>{{ editingId ? 'Editar' : 'Nueva' }} Categoría</h3>
        <div class="form-group">
          <label>Nombre</label>
          <input type="text" [(ngModel)]="form.nombre" placeholder="Nombre de la categoría">
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <textarea [(ngModel)]="form.descripcion" rows="3" placeholder="Descripción"></textarea>
        </div>
        <div class="form-group">
          <label>Imagen</label>
          <input type="file" (change)="onFileSelected($event)" accept="image/*">
        </div>
        <div class="error" *ngIf="error">{{ error }}</div>
        <button (click)="save()" class="btn-save">{{ editingId ? 'Actualizar' : 'Crear' }}</button>
      </div>

      <div class="cards-grid">
        <div *ngFor="let cat of categories" class="cat-card">
          <div class="cat-header">
            <h3>{{ cat.nombre }}</h3>
            <span [class]="cat.activo ? 'badge-yes' : 'badge-no'">{{ cat.activo ? 'Activa' : 'Inactiva' }}</span>
          </div>
          <p>{{ cat.descripcion }}</p>
          <div class="cat-actions">
            <button (click)="edit(cat)" class="btn-edit">✏️ Editar</button>
            <button (click)="delete(cat.id)" class="btn-delete">🗑️ Eliminar</button>
            <button (click)="deletePermanent(cat.id)" class="btn-delete" title="Eliminar permanentemente">❌</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-section h1 {
      color: #2d2d3f;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .btn-new {
      padding: 0.6rem 1.5rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      border: none; border-radius: 10px; color: white; cursor: pointer; font-weight: 600;
    }
    .form-card {
      background: #ffffff;
      border: 1px solid rgba(179,136,255,0.12);
      border-radius: 16px; padding: 2rem; margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(179,136,255,0.06);
    }
    .form-card h3 { color: #2d2d3f; margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; color: #666; margin-bottom: 0.3rem; font-size: 0.9rem; }
    .form-group input, .form-group textarea {
      width: 100%; padding: 0.65rem 0.8rem;
      background: #f9f7fc;
      border: 1px solid rgba(179,136,255,0.2);
      border-radius: 8px; color: #333; font-family: inherit;
    }
    .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #b388ff; }
    .error { color: #e74c3c; margin-bottom: 1rem; padding: 0.5rem; background: rgba(231,76,60,0.08); border-radius: 6px; }
    .btn-save {
      padding: 0.7rem 2rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      border: none; border-radius: 10px; color: white; cursor: pointer; font-weight: 600;
    }
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .cat-card {
      background: #ffffff;
      border: 1px solid rgba(179,136,255,0.12);
      border-radius: 16px; padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(179,136,255,0.06);
    }
    .cat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .cat-header h3 { color: #2d2d3f; }
    .badge-yes { color: #27ae60; background: rgba(46,204,113,0.1); padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem; }
    .badge-no { color: #c0392b; background: rgba(231,76,60,0.1); padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem; }
    .cat-card p { color: #888; font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.5; }
    .cat-actions { display: flex; gap: 0.5rem; }
    .btn-edit, .btn-delete {
      padding: 0.4rem 0.8rem;
      border-radius: 8px; cursor: pointer; font-size: 0.85rem; border: none;
    }
    .btn-edit { background: rgba(52,152,219,0.12); color: #2980b9; }
    .btn-delete { background: rgba(231,76,60,0.12); color: #c0392b; }
  `]
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  showForm = false;
  editingId: number | null = null;
  error = '';
  selectedFile: File | null = null;
  form = { nombre: '', descripcion: '' };

  constructor(private categoryService: CategoryService) {}

  ngOnInit() { this.load(); }

  load() {
    this.categoryService.getAdminCategories().subscribe(res => this.categories = res.data);
  }

  onFileSelected(event: any) { this.selectedFile = event.target.files[0] || null; }

  resetForm() { this.form = { nombre: '', descripcion: '' }; this.editingId = null; this.selectedFile = null; this.error = ''; }

  edit(cat: Category) {
    this.editingId = cat.id;
    this.form = { nombre: cat.nombre, descripcion: cat.descripcion };
    this.showForm = true;
  }

  save() {
    if (!this.form.nombre) { this.error = 'El nombre es requerido.'; return; }
    const fd = new FormData();
    fd.append('nombre', this.form.nombre);
    fd.append('descripcion', this.form.descripcion);
    if (this.selectedFile) fd.append('imagen', this.selectedFile);

    const req = this.editingId
      ? this.categoryService.updateCategory(this.editingId, fd)
      : this.categoryService.createCategory(fd);

    req.subscribe({
      next: () => { this.showForm = false; this.resetForm(); this.load(); },
      error: (err) => this.error = err.error?.message || 'Error al guardar.'
    });
  }

  delete(id: number) {
    if (confirm('¿Eliminar esta categoría?')) {
      this.categoryService.deleteCategory(id).subscribe(() => this.load());
    }
  }

  deletePermanent(id: number) {
    if (confirm('¿Eliminar PERMANENTEMENTE esta categoría? Esta acción no se puede deshacer.')) {
      this.categoryService.deleteCategoryPermanent(id).subscribe(() => this.load());
    }
  }
}
