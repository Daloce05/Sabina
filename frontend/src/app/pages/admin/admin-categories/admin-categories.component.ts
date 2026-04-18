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
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-section h1 {
      color: #eee;
      background: linear-gradient(135deg, #9b59b6, #e84393);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .btn-new {
      padding: 0.6rem 1.5rem;
      background: linear-gradient(135deg, #9b59b6, #e84393);
      border: none; border-radius: 10px; color: white; cursor: pointer; font-weight: 600;
    }
    .form-card {
      background: rgba(155,89,182,0.08);
      border: 1px solid rgba(155,89,182,0.2);
      border-radius: 16px; padding: 2rem; margin-bottom: 2rem;
    }
    .form-card h3 { color: #eee; margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; color: #aaa; margin-bottom: 0.3rem; font-size: 0.9rem; }
    .form-group input, .form-group textarea {
      width: 100%; padding: 0.65rem 0.8rem;
      background: rgba(20,10,30,0.8);
      border: 1px solid rgba(155,89,182,0.3);
      border-radius: 8px; color: #eee; font-family: inherit;
    }
    .error { color: #e74c3c; margin-bottom: 1rem; padding: 0.5rem; background: rgba(231,76,60,0.1); border-radius: 6px; }
    .btn-save {
      padding: 0.7rem 2rem;
      background: linear-gradient(135deg, #9b59b6, #e84393);
      border: none; border-radius: 10px; color: white; cursor: pointer; font-weight: 600;
    }
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .cat-card {
      background: rgba(155,89,182,0.08);
      border: 1px solid rgba(155,89,182,0.2);
      border-radius: 16px; padding: 1.5rem;
    }
    .cat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .cat-header h3 { color: #eee; }
    .badge-yes { color: #2ecc71; background: rgba(46,204,113,0.15); padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem; }
    .badge-no { color: #e74c3c; background: rgba(231,76,60,0.15); padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem; }
    .cat-card p { color: #888; font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.5; }
    .cat-actions { display: flex; gap: 0.5rem; }
    .btn-edit, .btn-delete {
      padding: 0.4rem 0.8rem;
      border-radius: 8px; cursor: pointer; font-size: 0.85rem; border: none;
    }
    .btn-edit { background: rgba(52,152,219,0.2); color: #3498db; }
    .btn-delete { background: rgba(231,76,60,0.2); color: #e74c3c; }
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
}
