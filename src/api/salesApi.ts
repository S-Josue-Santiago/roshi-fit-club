// roshi_fit/src/api/salesApi.ts
import api from './axiosInstance';

export interface SaleListItem {
  id: number;
  orden_numero: string; // número de factura o #id
  cliente_nombre: string;
  cliente_email: string;
  productos_resumen: string;
  total_q: string; // Prisma Decimal llega como string
  metodo_pago: string;
  estado_orden: 'pendiente' | 'pagada' | 'enviada' | 'cancelada' | 'completada';
  creacion_fecha: string;
}

export const fetchSales = async (params?: {
  search?: string;
  estado_orden?: 'pendiente' | 'pagada' | 'enviada' | 'cancelada' | 'completada';
  metodo_pago_id?: number | string;
  dateFrom?: string; // ISO date yyyy-mm-dd
  dateTo?: string; // ISO date yyyy-mm-dd
}) => {
  const res = await api.get<SaleListItem[]>('/sales', { params });
  return res.data;
};

export const fetchSaleDetail = async (id: number) => {
  const res = await api.get(`/sales/${id}`);
  return res.data;
};

export const fetchSaleInvoice = async (id: number) => {
  const res = await api.get(`/sales/${id}/invoice`);
  return res.data;
};
