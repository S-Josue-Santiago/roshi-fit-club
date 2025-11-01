// roshi_fit/src/api/serviceApi.ts
import api from './axiosInstance';
import { type Service, type ServiceFilters } from '../types/Service';


export const fetchTopServices = async (): Promise<Service[]> => {
  const res = await api.get<Service[]>('/services/top');
  return res.data; // ← Axios envuelve la respuesta en { data, status, ... }
};

export const fetchServices = async (filters: ServiceFilters): Promise<Service[]> => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  // if (filters.tipo_servicio) params.append('tipo_servicio', filters.tipo_servicio);
  // Always append 'estado' parameter, even if it's an empty string for 'Todos'
  params.append('estado', filters.estado);
  const res = await api.get<Service[]>(`/services?${params.toString()}`);
  return res.data;
};

export const fetchServiceById = async (id: number): Promise<Service> => {
  const res = await api.get<Service>(`/services/${id}`);
  return res.data;
};

export const createService = async ( data: {
  nombre: string;
  descripcion?: string;
  duracion_minutos?: number;
  precio_q: number;
  imagen?: string;
}): Promise<Service> => {
  const res = await api.post<Service>('/services', data);
  return res.data;
};

export const updateService = async (id: number, data:  {
  nombre?: string;
  descripcion?: string;
  duracion_minutos?: number;
  precio_q?: number;
  imagen?: string;
  estado?: string;
}): Promise<Service> => {
  const res = await api.patch<Service>(`/services/${id}`, data);
  return res.data;
};

export const toggleServiceStatus = async (id: number): Promise<Service> => {
  const res = await api.post<Service>(`/services/${id}/toggle-status`);
  return res.data;
};