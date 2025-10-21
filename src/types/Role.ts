// roshi_fit/src/types/Role.ts
export interface Role {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: 'activo' | 'inactivo' | 'desabilitado';
}