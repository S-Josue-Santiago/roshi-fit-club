// roshi_fit/src/api/categoryApi.ts
import api from './axiosInstance';
import type { Category, CategoryFilters } from '../types/Category';

export const fetchCategories = async (): Promise<Category[]> => {
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