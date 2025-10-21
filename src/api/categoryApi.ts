// roshi_fit/src/api/categoryApi.ts
import api from './axiosInstance';
import type { Category, CategoryFilters } from '../types/Category';

export const fetchCategories = async (filters: CategoryFilters): Promise<Category[]> => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.estado) params.append('estado', filters.estado);
  const res = await api.get<Category[]>(`/categories?${params.toString()}`);
  return res.data;
};

export const fetchCategoriesProducts = async (): Promise<Category[]> => {
  const res = await api.get<Category[]>('/categories');
  return res.data;
};

export const fetchCategoryById = async (id: number): Promise<Category> => {
  const res = await api.get<Category>(`/categories/${id}`);
  return res.data;
};

// Usa tipo inline (sin importar CreateCategoryData)
export const createCategory = async (data: {
  nombre: string;
  descripcion?: string;
}): Promise<Category> => {
  const res = await api.post<Category>('/categories', data);
  return res.data;
};

// Usa tipo inline (sin importar UpdateCategoryData)
export const updateCategory = async (id: number, data: {
  nombre?: string;
  descripcion?: string;
  estado?: string;
}): Promise<Category> => {
  const res = await api.patch<Category>(`/categories/${id}`, data);
  return res.data;
};

export const toggleCategoryStatus = async (id: number): Promise<Category> => {
  const res = await api.post<Category>(`/categories/${id}/toggle-status`);
  return res.data;
};