import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-section">
      <h1>Gestionar Usuarios</h1>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.id }}</td>
              <td>{{ user.nombre }} {{ user.apellido }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.telefono || '-' }}</td>
              <td>
                <span [class]="user.rol === 'admin' ? 'badge-admin' : 'badge-cliente'">{{ user.rol | titlecase }}</span>
              </td>
              <td>
                <span [class]="user.activo ? 'badge-yes' : 'badge-no'">{{ user.activo ? 'Activo' : 'Inactivo' }}</span>
              </td>
              <td>{{ user.createdAt | date:'dd/MM/yyyy' }}</td>
              <td class="actions">
                <button (click)="toggleActive(user.id)" class="btn-toggle" title="Activar/Desactivar">
                  {{ user.activo ? '🔒' : '🔓' }}
                </button>
                <button (click)="toggleRole(user)" class="btn-role" title="Cambiar rol">
                  {{ user.rol === 'admin' ? '👤' : '👑' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-section h1 {
      color: #eee; margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #9b59b6, #e84393);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th {
      background: rgba(155,89,182,0.1); color: #aaa; padding: 0.8rem;
      text-align: left; font-size: 0.85rem; text-transform: uppercase;
    }
    td {
      padding: 0.8rem; color: #ccc;
      border-bottom: 1px solid rgba(155,89,182,0.1); font-size: 0.9rem;
    }
    tr:hover { background: rgba(155,89,182,0.05); }
    .badge-admin { background: linear-gradient(135deg, rgba(155,89,182,0.3), rgba(232,67,147,0.3)); color: #e84393; padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem; }
    .badge-cliente { background: rgba(52,152,219,0.15); color: #3498db; padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem; }
    .badge-yes { color: #2ecc71; background: rgba(46,204,113,0.15); padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem; }
    .badge-no { color: #e74c3c; background: rgba(231,76,60,0.15); padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem; }
    .actions { display: flex; gap: 0.5rem; }
    .btn-toggle, .btn-role {
      background: none; border: none; cursor: pointer; font-size: 1.2rem; padding: 0.3rem;
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() { this.load(); }

  load() {
    this.userService.getUsers().subscribe(res => this.users = res.data);
  }

  toggleActive(id: number) {
    this.userService.toggleUser(id).subscribe(() => this.load());
  }

  toggleRole(user: User) {
    const newRol = user.rol === 'admin' ? 'cliente' : 'admin';
    if (confirm(`¿Cambiar rol de ${user.nombre} a ${newRol}?`)) {
      this.userService.changeRole(user.id, newRol).subscribe(() => this.load());
    }
  }
}
