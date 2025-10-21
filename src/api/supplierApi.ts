// roshi_fit/src/api/supplierApi.ts
import api from './axiosInstance';
import { type Supplier, type SupplierFilters, type CreateSupplierData, type UpdateSupplierData } from '../types/Supplier';

export const fetchSuppliers = async (filters: SupplierFilters): Promise<Supplier[]> => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.estado) params.append('estado', filters.estado);
  const res = await api.get<Supplier[]>(`/suppliers?${params.toString()}`);
  return res.data;
};

export const fetchSupplierById = async (id: number): Promise<Supplier & { direccion: string | null; rfc_nit: string | null }> => {
  const res = await api.get(`/suppliers/${id}`);
  return res.data;
};

export const createSupplier = async (data: CreateSupplierData): Promise<Supplier> => {
  const res = await api.post<Supplier>('/suppliers', data);
  return res.data;
};

export const updateSupplier = async (id: number, data: UpdateSupplierData): Promise<Supplier> => {
  const res = await api.patch<Supplier>(`/suppliers/${id}`, data);
  return res.data;
};

export const toggleSupplierStatus = async (id: number): Promise<Supplier> => {
  const res = await api.post<Supplier>(`/suppliers/${id}/toggle-status`);
  return res.data;
};