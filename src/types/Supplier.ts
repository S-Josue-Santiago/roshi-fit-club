// roshi_fit/src/types/Supplier.ts
export interface Supplier {
  id: number;
  nombre_empresa: string;
  contacto_nombre: string | null;
  email: string;
  telefono: string | null;
  estado: 'activo' | 'inactivo' | 'desabilitado';
}

export interface SupplierFilters {
  search: string;
  estado: string;
}

export interface CreateSupplierData {
  nombre_empresa: string;
  contacto_nombre?: string;
  email: string;
  telefono?: string;
  direccion?: string;
  rfc_nit?: string;
}

export interface UpdateSupplierData {
  nombre_empresa?: string;
  contacto_nombre?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  rfc_nit?: string;
  estado?: string;
}