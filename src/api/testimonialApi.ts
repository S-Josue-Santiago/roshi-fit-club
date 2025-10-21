// roshi_fit/src/api/testimonialApi.ts
import api from './axiosInstance';
import { type Testimonial } from '../types/Testimonial';

export const fetchActiveTestimonials = async (): Promise<Testimonial[]> => {
  const res = await api.get<Testimonial[]>('/testimonials/active');
  return res.data;
};