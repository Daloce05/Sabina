import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingService } from '../../../services/setting.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-section">
      <div class="section-header">
        <h1>Configuración de Contacto</h1>
      </div>

      <div *ngIf="loading" class="loading">Cargando configuraciones...</div>

      <div *ngIf="!loading" class="settings-container">
        <!-- Nombre empresa -->
        <div class="form-card">
          <h3>🍄 Información de la Empresa</h3>
          <div class="form-group">
            <label>Nombre de la empresa</label>
            <input type="text" [(ngModel)]="form.nombre_empresa" placeholder="Nombre de la empresa">
          </div>
        </div>

        <!-- Método de contacto -->
        <div class="form-card">
          <h3>📱 Método de Contacto Principal</h3>
          <p class="hint">Selecciona cómo deseas que los clientes te contacten al hacer pedidos.</p>

          <div class="contact-methods">
            <div class="method-option" [class.selected]="form.contacto_metodo === 'whatsapp'" (click)="form.contacto_metodo = 'whatsapp'">
              <span class="method-icon">💬</span>
              <span class="method-label">WhatsApp</span>
            </div>
            <div class="method-option" [class.selected]="form.contacto_metodo === 'telefono'" (click)="form.contacto_metodo = 'telefono'">
              <span class="method-icon">📞</span>
              <span class="method-label">Teléfono</span>
            </div>
            <div class="method-option" [class.selected]="form.contacto_metodo === 'email'" (click)="form.contacto_metodo = 'email'">
              <span class="method-icon">📧</span>
              <span class="method-label">Email</span>
            </div>
            <div class="method-option" [class.selected]="form.contacto_metodo === 'instagram'" (click)="form.contacto_metodo = 'instagram'">
              <span class="method-icon">📸</span>
              <span class="method-label">Instagram</span>
            </div>
          </div>
        </div>

        <!-- Datos de contacto -->
        <div class="form-card">
          <h3>📋 Datos de Contacto</h3>
          <p class="hint">Completa los datos de los métodos que desees usar. El método seleccionado arriba será el principal.</p>

          <div class="form-group">
            <label>
              💬 Número de WhatsApp
              <span *ngIf="form.contacto_metodo === 'whatsapp'" class="badge-active">Activo</span>
            </label>
            <input type="text" [(ngModel)]="form.contacto_whatsapp" placeholder="Ej: 573195631384 (con código de país, sin +)">
            <small class="field-hint">Incluye el código de país sin el signo +. Ej: 57 para Colombia</small>
          </div>

          <div class="form-group">
            <label>
              📞 Teléfono
              <span *ngIf="form.contacto_metodo === 'telefono'" class="badge-active">Activo</span>
            </label>
            <input type="text" [(ngModel)]="form.contacto_telefono" placeholder="Ej: 3195631384">
          </div>

          <div class="form-group">
            <label>
              📧 Email
              <span *ngIf="form.contacto_metodo === 'email'" class="badge-active">Activo</span>
            </label>
            <input type="email" [(ngModel)]="form.contacto_email" placeholder="Ej: contacto@sabinafungi.com">
          </div>

          <div class="form-group">
            <label>
              📸 Instagram
              <span *ngIf="form.contacto_metodo === 'instagram'" class="badge-active">Activo</span>
            </label>
            <div class="input-with-prefix">
              <span class="input-prefix">&#64;</span>
              <input type="text" [(ngModel)]="form.contacto_instagram" placeholder="Ej: sabinafungi">
            </div>
          </div>
        </div>

        <div *ngIf="error" class="error">{{ error }}</div>
        <div *ngIf="successMsg" class="success">{{ successMsg }}</div>

        <button (click)="save()" [disabled]="saving" class="btn-save">
          {{ saving ? 'Guardando...' : '💾 Guardar Configuración' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .admin-section h1 {
      color: #eee;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .loading { color: #aaa; text-align: center; padding: 3rem; }
    .settings-container { max-width: 700px; }
    .form-card {
      background: rgba(179,136,255,0.08);
      border: 1px solid rgba(179,136,255,0.2);
      border-radius: 16px; padding: 2rem; margin-bottom: 1.5rem;
    }
    .form-card h3 { color: #eee; margin-bottom: 0.5rem; }
    .hint { color: #888; font-size: 0.85rem; margin-bottom: 1.2rem; }
    .form-group { margin-bottom: 1.2rem; }
    .form-group label { display: flex; align-items: center; gap: 0.5rem; color: #aaa; margin-bottom: 0.3rem; font-size: 0.9rem; }
    .form-group input, .form-group textarea {
      width: 100%; padding: 0.65rem 0.8rem;
      background: rgba(20,10,30,0.8);
      border: 1px solid rgba(179,136,255,0.3);
      border-radius: 8px; color: #eee; font-family: inherit;
      box-sizing: border-box;
    }
    .form-group input:focus {
      outline: none;
      border-color: #b388ff;
      box-shadow: 0 0 0 2px rgba(179,136,255,0.2);
    }
    .field-hint { color: #666; font-size: 0.8rem; margin-top: 0.3rem; display: block; }

    .contact-methods {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;
    }
    .method-option {
      display: flex; align-items: center; gap: 0.8rem;
      padding: 1rem 1.2rem;
      background: rgba(20,10,30,0.6);
      border: 2px solid rgba(179,136,255,0.15);
      border-radius: 12px; cursor: pointer;
      transition: all 0.3s;
    }
    .method-option:hover {
      border-color: rgba(179,136,255,0.4);
      background: rgba(179,136,255,0.08);
    }
    .method-option.selected {
      border-color: #b388ff;
      background: rgba(179,136,255,0.15);
      box-shadow: 0 0 15px rgba(179,136,255,0.2);
    }
    .method-icon { font-size: 1.5rem; }
    .method-label { color: #eee; font-weight: 600; font-size: 0.95rem; }

    .badge-active {
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      color: white;
      padding: 0.15rem 0.5rem;
      border-radius: 8px;
      font-size: 0.7rem;
      font-weight: 600;
    }

    .input-with-prefix {
      display: flex; align-items: center;
      background: rgba(20,10,30,0.8);
      border: 1px solid rgba(179,136,255,0.3);
      border-radius: 8px;
      overflow: hidden;
    }
    .input-prefix {
      padding: 0.65rem 0.8rem;
      color: #888;
      background: rgba(179,136,255,0.1);
      border-right: 1px solid rgba(179,136,255,0.3);
      font-size: 0.9rem;
    }
    .input-with-prefix input {
      border: none !important;
      border-radius: 0 !important;
      background: transparent !important;
    }

    .error { color: #e74c3c; margin-bottom: 1rem; padding: 0.8rem; background: rgba(231,76,60,0.1); border-radius: 8px; }
    .success { color: #2ecc71; margin-bottom: 1rem; padding: 0.8rem; background: rgba(46,204,113,0.1); border-radius: 8px; }

    .btn-save {
      padding: 0.8rem 2.5rem;
      background: linear-gradient(135deg, #b388ff, #ff80ab);
      border: none; border-radius: 12px; color: white; cursor: pointer;
      font-weight: 600; font-size: 1rem;
      transition: all 0.3s;
    }
    .btn-save:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(179,136,255,0.3); }
    .btn-save:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  `]
})
export class AdminSettingsComponent implements OnInit {
  loading = true;
  saving = false;
  error = '';
  successMsg = '';

  form = {
    nombre_empresa: 'Sabina Fungi',
    contacto_metodo: 'whatsapp',
    contacto_whatsapp: '',
    contacto_telefono: '',
    contacto_email: '',
    contacto_instagram: ''
  };

  constructor(private settingService: SettingService) {}

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.settingService.getAllSettings().subscribe({
      next: (res) => {
        if (res.success) {
          res.data.forEach(s => {
            if (s.clave in this.form) {
              (this.form as any)[s.clave] = s.valor;
            }
          });
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar configuraciones.';
        this.loading = false;
      }
    });
  }

  save() {
    this.saving = true;
    this.error = '';
    this.successMsg = '';

    const metodo = this.form.contacto_metodo;
    if (metodo === 'whatsapp' && !this.form.contacto_whatsapp.trim()) {
      this.error = 'Debes ingresar el número de WhatsApp si es el método activo.';
      this.saving = false;
      return;
    }
    if (metodo === 'telefono' && !this.form.contacto_telefono.trim()) {
      this.error = 'Debes ingresar el teléfono si es el método activo.';
      this.saving = false;
      return;
    }
    if (metodo === 'email' && !this.form.contacto_email.trim()) {
      this.error = 'Debes ingresar el email si es el método activo.';
      this.saving = false;
      return;
    }
    if (metodo === 'instagram' && !this.form.contacto_instagram.trim()) {
      this.error = 'Debes ingresar el usuario de Instagram si es el método activo.';
      this.saving = false;
      return;
    }

    const settings = Object.entries(this.form).map(([clave, valor]) => ({ clave, valor }));

    this.settingService.updateSettings(settings).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMsg = 'Configuración guardada correctamente.';
          setTimeout(() => this.successMsg = '', 4000);
        }
        this.saving = false;
      },
      error: () => {
        this.error = 'Error al guardar configuraciones.';
        this.saving = false;
      }
    });
  }
}
