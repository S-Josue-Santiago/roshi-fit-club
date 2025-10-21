// roshi_fit/src/types/Category.ts
export interface Category {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: 'activo' | 'inactivo' | 'desabilitado';
}

export interface CategoryFilters {
  search: string;
  estado: string;
}

export interface CreateCategoryData {
  nombre: string;
  descripcion?: string;
}

export interface UpdateCategoryData {
  nombre?: string;
  descripcion?: string;
  estado?: string;
}