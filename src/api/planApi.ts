// roshi_fit/src/api/planApi.ts
import api from './axiosInstance';
import type { Plan, PlanDetail, PlanFilters  } from '../types/Plan';

export const fetchActivePlans = async (): Promise<Plan[]> => {
  const res = await api.get<Plan[]>('/plans/active');
  return res.data;
};

export const fetchPlansForRegistration = async (): Promise<Plan[]> => {
  const res = await api.get<Plan[]>('/plans/for-registration');
  return res.data;
};

export const fetchPlans = async (filters: PlanFilters): Promise<Plan[]> => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  // Always append 'estado' parameter, even if it's an empty string for 'Todos'
  if (filters.estado) params.append('estado', filters.estado);
  const res = await api.get<Plan[]>(`/plans?${params.toString()}`);
  return res.data;
};

export const fetchPlanById = async (id: number): Promise<PlanDetail> => {
  const res = await api.get<PlanDetail>(`/plans/${id}`);
  return res.data;
};

export const createPlan = async ( data:{
  nombre: string;
  descripcion?: string;
  precio_q: number;
  duracion_dias: number;
  imagen?: string;
  beneficios?: string;
}): Promise<Plan> => {
  const res = await api.post<Plan>('/plans', data);
  return res.data;
};

export const updatePlan = async (id: number, data: {
  nombre?: string;
  descripcion?: string;
  precio_q?: number;
  duracion_dias?: number;
  imagen?: string;
  beneficios?: string;
}): Promise<Plan> => {
  const res = await api.patch<Plan>(`/plans/${id}`, data);
  return res.data;
};

export const togglePlanStatus = async (id: number): Promise<Plan> => {
  const res = await api.post<Plan>(`/plans/${id}/toggle-status`);
  return res.data;
};

export const deletePlan = async (id: number): Promise<void> => {
  await api.delete(`/plans/${id}`);
};