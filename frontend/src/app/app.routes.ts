import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'productos', loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent) },
      { path: 'producto/:id', loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
      { path: 'mis-pedidos', loadComponent: () => import('./pages/my-orders/my-orders.component').then(m => m.MyOrdersComponent), canActivate: [authGuard] },
      { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent), canActivate: [guestGuard] },
      { path: 'registro', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent), canActivate: [guestGuard] },
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'productos', loadComponent: () => import('./pages/admin/admin-products/admin-products.component').then(m => m.AdminProductsComponent) },
      { path: 'categorias', loadComponent: () => import('./pages/admin/admin-categories/admin-categories.component').then(m => m.AdminCategoriesComponent) },
      { path: 'pedidos', loadComponent: () => import('./pages/admin/admin-orders/admin-orders.component').then(m => m.AdminOrdersComponent) },
      { path: 'usuarios', loadComponent: () => import('./pages/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];
