import { Product } from './product.model';

export interface OrderItem {
  id: number;
  productId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto?: Product;
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  estado: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
  direccionEnvio: string;
  telefono: string;
  notas: string;
  items: OrderItem[];
  usuario?: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  };
  createdAt: string;
}

export interface CartItem {
  product: Product;
  cantidad: number;
}

export interface CreateOrderRequest {
  items: { productId: number; cantidad: number }[];
  direccionEnvio: string;
  telefono: string;
  notas?: string;
}
