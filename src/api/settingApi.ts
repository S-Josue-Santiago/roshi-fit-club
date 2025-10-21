// roshi_fit/src/api/settingApi.ts
import api from './axiosInstance';
import type { Settings } from '../types/Setting';

export const fetchSettings = async (): Promise<Settings> => {
  const res = await api.get<Settings>('/settings');
  return res.data;
};

export const updateSetting = async (clave: string, valor: string): Promise<void> => {
  await api.post('/settings/update', { clave, valor });
};