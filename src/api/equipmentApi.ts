// roshi_fit/src/api/equipmentApi.ts
import api from './axiosInstance';
import type { Equipment, EquipmentFilters,  } from '../types/Equipment';

export const fetchActiveEquipment = async (): Promise<Equipment[]> => {
  const res = await api.get<Equipment[]>('/equipment/active');
  return res.data;
};

//admin


export const fetchEquipment = async (filters: EquipmentFilters): Promise<Equipment[]> => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.tipo) params.append('tipo', filters.tipo);
  if (filters.estado_equipo) params.append('estado_equipo', filters.estado_equipo);
  if (filters.estado) params.append('estado', filters.estado);
  const res = await api.get<Equipment[]>(`/equipment?${params.toString()}`);
  return res.data;
};

export const fetchEquipmentTypes = async (): Promise<string[]> => {
  const res = await api.get<string[]>('/equipment/types');
  return res.data;
};

export const fetchEquipmentById = async (id: number): Promise<Equipment> => {
  const res = await api.get<Equipment>(`/equipment/${id}`);
  return res.data;
};

// ✅ Usa tipo inline
export const createEquipment = async (data: {
  nombre: string;
  tipo?: string;
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  ubicacion?: string;
  estado_equipo?: string;
  ultima_revision?: string;
  proxima_revision?: string;
  imagen?: string;
}): Promise<any> => {
  const res = await api.post<any>('/equipment', data);
  return res.data;
};

// ✅ Usa tipo inline
export const updateEquipment = async (id: number, data: {
  nombre?: string;
  tipo?: string;
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  ubicacion?: string;
  estado_equipo?: string;
  ultima_revision?: string;
  proxima_revision?: string;
  estado?: string;
  imagen?: string;
}): Promise<any> => {
  const res = await api.patch<any>(`/equipment/${id}`, data);
  return res.data;
};


export const toggleEquipmentStatus = async (id: number): Promise<Equipment> => {
  const res = await api.post<Equipment>(`/equipment/${id}/toggle-status`);
  return res.data;
};