// roshi_fit/src/types/User.ts
export interface RegisterWithPlanParams {
  nombre_completo: string;
  email: string;
  contrasena: string;
  plan_id: number;
  metodo_pago_id: number;
  detalles_pago?: Record<string, any>; // Campos dinámicos por método
}

// roshi_fit/src/types/User.ts
export interface User {
  id: number;
  nombre_completo: string;
  email: string;
  tipo_usuario: 'admin' | 'cliente' | 'entrenador';
  estado: 'activo' | 'inactivo' | 'desabilitado';
  creacion_fecha: string;
  rol_id: number | null;
}

export interface UserFilters {
  search: string;
  tipo_usuario: string;
  estado: string;
}

// NUEVA FUNCIÓN
export interface AdminCreateUserParams {
  nombre_completo: string;
  email: string;
  contrasena: string;
  tipo_usuario: 'admin' | 'cliente' | 'entrenador';
}

export interface AdminCreateUserWithSubscriptionParams {
  nombre_completo: string;
  email: string;
  contrasena: string;
  plan_id: number;
  metodo_pago_id: number;
  detalles_pago?: Record<string, any>;
}

export interface StaffCreateParams {
  nombre_completo: string;
  email: string;
  contrasena: string;
  tipo_usuario: 'admin' | 'entrenador';
}
