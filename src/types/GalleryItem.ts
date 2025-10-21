// roshi_fit/src/types/GalleryItem.ts
export interface GalleryItem {
  id: number;
  titulo: string | null;
  descripcion: string | null;
  categoria: string | null;
  imagen_url: string;
  estado: 'activo' | 'inactivo' | 'desabilitado';
}

export interface GalleryItemFilters {
  search: string;
  categoria: string;
  estado: string;
}

export interface CreateGalleryItemData {
  titulo?: string;
  descripcion?: string;
  categoria?: string;
  imagen_url: string;
  orden_visual?: number;
}

export interface UpdateGalleryItemData {
  titulo?: string;
  descripcion?: string;
  categoria?: string;
  imagen_url?: string;
  orden_visual?: number;
  estado?: string;
}