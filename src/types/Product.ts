// roshi_fit/src/types/Product.ts

export interface TopProduct {
  id: number;
  nombre: string;
  descripcion: string | null;
  sku: string | null;
  precio_venta_q: string | number; // Prisma lo envía como string
  imagen_principal: string | null;
}

// admin
export interface Category {
  id: number;
  nombre: string;
}

export interface Product {
  id: number;
  nombre: string;
  descripcion: string | null;
  categoria_id: number;
  sku: string | null;
  precio_venta_q: number;
  stock: number | null;
  imagen_principal: string | null;
  estado: 'activo' | 'inactivo' | 'desabilitado';
  categorias_producto?: Category;
}

export interface ProductFilters {
  search: string;
  categoria_id: string;
  estado: string;
}

export interface CreateProductData {
  nombre: string;
  descripcion?: string;
  categoria_id: number;
  sku?: string;
  precio_venta_q: number;
  stock?: number;
  imagen_principal?: string;
}

export interface UpdateProductData {
  nombre?: string;
  descripcion?: string;
  categoria_id?: number;
  sku?: string;
  precio_venta_q?: number;
  stock?: number;
  estado?: string;
  imagen_principal?: string; // ✅ Añadido
}