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


export const fetchPlansWithActiveUsers = async (filters: PlanFilters): Promise<Plan[]> => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  const res = await api.get<Plan[]>(`/plans/with-active-users?${params.toString()}`);
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