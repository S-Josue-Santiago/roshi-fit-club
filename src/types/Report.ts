// roshi_fit/src/types/Report.ts
export interface SubscriptionReportData {
  plan: string;
  nuevas: number;
  activas: number;
  ingresos: number;
}

export interface ProductReportData {
  nombre: string;
  unidades: number;
  ingresos: number;
}

export interface UserReportData {
  nuevos: { dia: string; nuevos: number }[];
  activos: number;
}

export interface ClassReportData {
  clase: string;
  reservas: number;
  asistentes: number;
  tasa_asistencia: number;
}

export interface EquipmentReportData {
  nombre: string;
  estado_equipo: string;
  proxima_revision: string;
  estado_revision: string;
}

export interface TrainingReportData {
  sessionsByTrainer: {
    nombre_completo: string;
    sesiones: number;
  }[];
  evaluations: {
    dia: string;
    evaluaciones: number;
  }[];
}

export interface SystemActivityReportData {
  accion: string;
  frecuencia: number;
}

export interface FinancialReportData {
  ingresos_productos: number;
  ingresos_suscripciones: number;
  total_ingresos: number;
}