export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string | null;
  categoryId: number;
  destacado: boolean;
  activo: boolean;
  categoria?: {
    id: number;
    nombre: string;
  };
  createdAt: string;
}

export interface ProductResponse {
  success: boolean;
  data: {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  };
}
