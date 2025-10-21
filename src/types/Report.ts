// roshi_fit/src/types/Report.ts
export interface SubscriptionReportItem {
  plan: string;
  nuevas: number;
  activas: number;
  ingresos: number;
}

export interface ProductReportItem {
  nombre: string;
  unidades: number;
  ingresos: number;
}

export interface UserReport {
  nuevos: { dia: string; nuevos: number }[];
  activos: number;
}

export interface ClassReportItem {
  clase: string;
  reservas: number;
  asistentes: number;
  tasa_asistencia: number;
}

export interface EquipmentReportItem {
  nombre: string;
  estado_equipo: string;
  proxima_revision: string;
  estado_revision: string;
}