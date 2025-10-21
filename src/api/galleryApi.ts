// roshi_fit/src/api/galleryApi.ts
import api from './axiosInstance';
import type { GalleryItem, GalleryItemFilters } from '../types/GalleryItem';

export const fetchActiveGalleryItems = async (): Promise<GalleryItem[]> => {
  const res = await api.get<GalleryItem[]>('/gallery/active');
  return res.data;
};

export const fetchGalleryItems = async (filters: GalleryItemFilters): Promise<GalleryItem[]> => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.categoria) params.append('categoria', filters.categoria);
  if (filters.estado) params.append('estado', filters.estado);
  const res = await api.get<GalleryItem[]>(`/gallery?${params.toString()}`);
  return res.data;
};

export const fetchGalleryItemById = async (id: number): Promise<GalleryItem & { orden_visual: number }> => {
  const res = await api.get(`/gallery/${id}`);
  return res.data;
};

export const createGalleryItem = async ( data:{
  titulo?: string;
  descripcion?: string;
  categoria?: string;
  imagen_url: string;
  orden_visual?: number;
}): Promise<GalleryItem> => {
  const res = await api.post<GalleryItem>('/gallery', data);
  return res.data;
};

export const updateGalleryItem = async (id: number,  data:{
  titulo?: string;
  descripcion?: string;
  categoria?: string;
  imagen_url?: string;
  orden_visual?: number;
  estado?: string;
}): Promise<GalleryItem> => {
  const res = await api.patch<GalleryItem>(`/gallery/${id}`, data);
  return res.data;
};

export const toggleGalleryItemStatus = async (id: number): Promise<GalleryItem> => {
  const res = await api.post<GalleryItem>(`/gallery/${id}/toggle-status`);
  return res.data;
};