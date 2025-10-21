// roshi_fit/src/api/authApi.ts
import api from './axiosInstance';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    tipo: 'admin' | 'cliente' | 'entrenador';
  };
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>('/auth/login', credentials);
  return res.data;
};