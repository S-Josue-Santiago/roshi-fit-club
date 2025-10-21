// roshi_fit/src/api/userApi.ts
import api from './axiosInstance';
import { type RegisterWithPlanParams, type User, type AdminCreateUserParams, type AdminCreateUserWithSubscriptionParams, type StaffCreateParams} from '../types/User';

export const registerUserWithPlan = async (data: RegisterWithPlanParams) => {
  const res = await api.post('/users/register-with-plan', data);
  return res.data;
};

// NUEVA FUNCIÓN: Obtener usuarios con filtros
export const fetchUsers = async (filters: {
  search?: string;
  tipo_usuario?: string;
  estado?: string;
}): Promise<User[]> => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.tipo_usuario) params.append('tipo_usuario', filters.tipo_usuario);
  if (filters.estado) params.append('estado', filters.estado);

  const res = await api.get<User[]>(`/users?${params.toString()}`);
  return res.data;
};

// NUEVA FUNCIÓN: Restablecer contraseña
export const resetUserPassword = async (userId: number, newPassword: string): Promise<void> => {
  await api.post(`/users/${userId}/reset-password`, { newPassword }); // ← { newPassword }
};

// NUEVA FUNCIÓN: Actualizar usuario
export const updateUser = async (userId: number, data: Partial<User>): Promise<User> => {
  const res = await api.patch<User>(`/users/${userId}`, data);
  return res.data;
};



export const createUserFromAdmin = async (data: AdminCreateUserParams) => {
  const res = await api.post('/users/admin-create', data);
  return res.data;
};



export const createUserWithSubscription = async (
  data: AdminCreateUserWithSubscriptionParams // ← 'data' es el nombre del parámetro, tipado con la interfaz
) => {
  const res = await api.post('/users/admin-create-with-subscription', data);
  return res.data;
};




// 2. FUNCIÓN CORREGIDA
export const createStaffUser = async (data: StaffCreateParams) => {
  const res = await api.post('/users/admin-create-staff', data);
  return res.data;
};