// roshi_fit/src/types/Sale.ts
export interface SaleListItem {
  id: number;
  orden_numero: string;
  cliente_nombre: string;
  cliente_email: string;
  productos_resumen: string;
  total_q: string;
  metodo_pago: string;
  estado_orden: string;
  creacion_fecha: string;
}