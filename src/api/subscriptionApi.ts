// roshi_fit/src/api/subscriptionApi.ts
import api from './axiosInstance';

export interface SubscriptionListItem {
  id: number;
  usuario_id: number;
  plan_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado_suscripcion: 'activa' | 'vencida' | 'cancelada' | 'suspendida';
  dias_restantes: number;
  computed_estado: 'activa' | 'vencida' | 'cancelada' | 'suspendida';
  usuario: { id: number; nombre_completo: string; email: string; telefono?: string | null };
  plan: { id: number; nombre: string; precio_q: string; duracion_dias: number };
}

export interface RenewPayload {
  usuario_id: number;
  plan_id: number;
  metodo_pago_id: number;
  detalles?: any;
}

export const fetchSubscriptions = async (params?: {
  search?: string;
  planId?: number | string;
  estado?: 'activa' | 'vencida' | 'cancelada' | 'suspendida';
  orderDays?: 'asc' | 'desc';
}) => {
  const res = await api.get<SubscriptionListItem[]>('/subscriptions', { params });
  return res.data;
};

export const extendSubscription = async (id: number, dias: number) => {
  const res = await api.patch(`/subscriptions/${id}/extend`, { dias });
  return res.data;
};

export const cancelSubscription = async (id: number) => {
  const res = await api.patch(`/subscriptions/${id}/cancel`);
  return res.data;
};

export const renewSubscription = async (payload: RenewPayload) => {
  const res = await api.post('/subscriptions/renew', payload);
  return res.data;
};

export const fetchSubscriptionHistory = async (userId: number) => {
  const res = await api.get(`/subscriptions/${userId}/history`);
  return res.data as any[];
};
