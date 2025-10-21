// roshi_fit/src/api/paymentMethodApi.ts
import api from './axiosInstance';
import { type PaymentMethod } from '../types/PaymentMethod';

export const fetchActivePaymentMethods = async (): Promise<PaymentMethod[]> => {
  const res = await api.get<PaymentMethod[]>('/payment-methods/active');
  return res.data;
}; 