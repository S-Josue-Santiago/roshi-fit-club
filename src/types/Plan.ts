
// roshi_fit/src/types/Plan.ts
export interface Plan {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_q: string | number; // Prisma lo envía como string
  beneficios: Record<string, boolean> | null; // JSON se parsea como array
  duracion_dias: number;
  imagen: string | null;
  usuarios_activos: number;
}

export interface PlanDetail {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_q: number;
  duracion_dias: number;
  imagen: string | null;
  beneficios: string[] | null;
}

export interface PlanFilters {
  search: string;
}

export interface CreatePlanData {
  nombre: string;
  descripcion?: string;
  precio_q: number;
  duracion_dias: number;
  imagen?: string;
  beneficios?: string;
}

export interface UpdatePlanData {
  nombre?: string;
  descripcion?: string;
  precio_q?: number;
  duracion_dias?: number;
  imagen?: string;
  beneficios?: string;
}