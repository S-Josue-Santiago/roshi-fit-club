// roshi_fit/src/api/contentApi.ts
import api from './axiosInstance';
import { type ContactContent } from '../types/Content';

export const fetchContactContent = async (): Promise<ContactContent> => {
  const res = await api.get<ContactContent>('/content/contact');
  return res.data;
};