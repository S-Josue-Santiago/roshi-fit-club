// roshi_fit/src/api/scheduleApi.ts
import api from './axiosInstance';
import { type Schedule } from '../types/Schedule';

export const fetchGeneralSchedules = async (): Promise<Schedule[]> => {
  const res = await api.get<Schedule[]>('/schedules/general');
  return res.data;
};