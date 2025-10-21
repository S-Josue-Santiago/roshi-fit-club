// roshi_fit/src/api/productApi.ts
import api from './axiosInstance';
import { type Product, type ProductFilters, type TopProduct } from '../types/Product';

export const fetchTopSellingProducts = async (): Promise<TopProduct[]> => {
  const res = await api.get<TopProduct[]>('/products/top-selling');
  return res.data;
};

// admin

// 1. Obtener productos con filtros
export const fetchProducts = async (filters: ProductFilters): Promise<Product[]> => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.categoria_id) params.append('categoria_id', filters.categoria_id);
  if (filters.estado) params.append('estado', filters.estado);

  const res = await api.get<Product[]>(`/products?${params.toString()}`);
  return res.data;
};

// 2. Obtener producto por ID
export const fetchProductById = async (id: number): Promise<Product> => {
  const res = await api.get<Product>(`/products/${id}`);
  return res.data;
};

// 3. Crear producto → usa un tipo inline
export const createProduct = async (data: {
  nombre: string;
  descripcion?: string;
  categoria_id: number;
  sku?: string;
  precio_venta_q: number;
  stock?: number;
  imagen_principal?: string;
}): Promise<Product> => {
  const res = await api.post<Product>('/products', data);
  return res.data;
};

// 4. Actualizar producto → usa un tipo inline
// 4. Actualizar producto → incluye imagen_principal
export const updateProduct = async (id: number, data: {
  nombre?: string;
  descripcion?: string;
  categoria_id?: number;
  sku?: string;
  precio_venta_q?: number;
  stock?: number;
  estado?: string;
  imagen_principal?: string; // ← ¡Añadido!
}): Promise<Product> => {
  const res = await api.patch<Product>(`/products/${id}`, data);
  return res.data;
};

// 5. Activar/Desactivar producto
export const toggleProductStatus = async (id: number): Promise<Product> => {
  const res = await api.post<Product>(`/products/${id}/toggle-status`);
  return res.data;
};

// NUEVA FUNCIÓN: Actualizar stock
export const updateProductStock = async (id: number, stock: number): Promise<Product> => {
  const res = await api.post<Product>(`/products/${id}/stock`, { stock });
  return res.data;
};