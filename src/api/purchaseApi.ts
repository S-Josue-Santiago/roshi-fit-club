// roshi_fit/src/api/purchaseApi.ts
import api from './axiosInstance';
import type {
  AddToCartParams,
  CheckoutParams,
  CartResponse
} from '../types/Purchase';

// 1. Agregar producto al carrito
export const addToCart = async (data: AddToCartParams): Promise<void> => {
  await api.post('/purchase/cart', data);
};

// 2. Obtener carrito del usuario
export const getCart = async (usuarioId: number): Promise<CartResponse> => {
  const res = await api.get<CartResponse>(`/purchase/cart/${usuarioId}`);
  return res.data;
};

// 3. Realizar compra (checkout)
export const checkout = async (data: CheckoutParams): Promise<{ orden_id: number }> => {
  const res = await api.post<{ orden_id: number }>('/purchase/checkout', data);
  return res.data;
};