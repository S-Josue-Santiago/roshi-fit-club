// roshi_fit/src/api/uploadApi.ts
import api from './axiosInstance';

export const uploadProductImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await api.post<{ filename: string }>('/upload/product-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.filename;
};
export const uploadProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await api.post<{ filename: string }>('/upload/profile-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.filename;
};