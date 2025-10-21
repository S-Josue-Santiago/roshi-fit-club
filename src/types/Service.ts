// roshi_fit/src/types/Service.ts
export interface Service {
  id: number;
  nombre: string;
  descripcion: string;
  precio_q: number;
  imagen: string | null;
}

// roshi_fit/src/types/Service.ts
export interface Service {
  id: number;
  nombre: string;
  descripcion: string;
  duracion_minutos: number | null;
  precio_q: number;
  imagen: string | null;
  estado: 'activo' | 'inactivo' | 'desabilitado';
}

export interface ServiceFilters {
  search: string;
  estado: string;
}

export interface CreateServiceData {
  nombre: string;
  descripcion?: string;
  duracion_minutos?: number;
  precio_q: number;
  imagen?: string;
}

export interface UpdateServiceData {
  nombre?: string;
  descripcion?: string;
  duracion_minutos?: number;
  precio_q?: number;
  imagen?: string;
  estado?: string;
}