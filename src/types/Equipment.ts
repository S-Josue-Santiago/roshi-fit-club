// // roshi_fit/src/types/Equipment.ts
// export interface Equipment {
//   id: number;
//   nombre: string;
//   tipo: string | null;
//   imagen: string | null;
// }
// roshi_fit/src/types/Equipment.ts
export interface Equipment {
  id: number;
  nombre: string;
  tipo: string | null;
  marca: string | null;
  modelo: string | null;
  numero_serie: string | null;
  ubicacion: string | null;
  estado_equipo: 'funcional' | 'en_mantenimiento' | 'fuera_de_servicio';
  ultima_revision: string | null;
  proxima_revision: string | null;
  imagen: string | null;
  estado: 'activo' | 'inactivo' | 'desabilitado';
}

export interface EquipmentFilters {
  search: string;
  tipo: string;
  estado_equipo: string;
  estado: string;
}

export interface CreateEquipmentData {
  nombre: string;
  tipo?: string;
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  ubicacion?: string;
  estado_equipo?: string;
  ultima_revision?: string;
  proxima_revision?: string;
  imagen?: string;
}

export interface UpdateEquipmentData {
  nombre?: string;
  tipo?: string;
  marca?: string;
  modelo?: string;
  numero_serie?: string;
  ubicacion?: string;
  estado_equipo?: string;
  ultima_revision?: string;
  proxima_revision?: string;
  estado?: string;
  imagen?: string;
}