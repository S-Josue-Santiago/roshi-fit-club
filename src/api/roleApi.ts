// roshi_fit/src/api/roleApi.ts
import api from './axiosInstance';
import { type Role } from '../types/Role';

export const fetchRoles = async (filters: {
  search?: string;
  estado?: string;
}): Promise<Role[]> => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.estado) params.append('estado', filters.estado);

  const res = await api.get<Role[]>(`/roles?${params.toString()}`);
  return res.data;
};