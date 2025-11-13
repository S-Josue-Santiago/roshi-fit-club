// roshi_fit/src/api/testimonialApi.ts
import api from './axiosInstance';
import type {Testimonial,   ClientTestimonial, 
  CreateTestimonialData, 
  UpdateTestimonialData  } from '../types/Testimonial';

export const fetchActiveTestimonials = async (): Promise<Testimonial[]> => {
  const res = await api.get<Testimonial[]>('/testimonials/active');
  return res.data;
};

// para testimonios en clientes
export const fetchClientTestimonials = async (userId: number): Promise<ClientTestimonial[]> => {
  const res = await api.get<ClientTestimonial[]>(`/testimonials/client/${userId}`);
  return res.data;
};

export const createTestimonial = async (data: CreateTestimonialData): Promise<ClientTestimonial> => {
  const res = await api.post<ClientTestimonial>('/testimonials', data);
  return res.data;
};

export const updateTestimonial = async (id: number, data: UpdateTestimonialData): Promise<ClientTestimonial> => {
  const res = await api.patch<ClientTestimonial>(`/testimonials/${id}`, data);
  return res.data;
};

/**
 * Alterna el estado de un testimonio (activo/inactivo).
 * @param id - El ID del testimonio a modificar.
 */
export const toggleTestimonialStatus = async (id: number): Promise<void> => {
  await api.patch(`/testimonials/${id}/toggle-status`);
};