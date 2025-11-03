// roshi_fit/src/api/purchaseApi.ts
import api from './axiosInstance';
import type {
  AddToCartParams,
  CheckoutParams,
  CartResponse,
  UpdateCartItemQuantityParams,
  RemoveCartItemParams
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

// 4. Actualizar cantidad de un ítem en el carrito
export const updateCartItemQuantity = async (data: UpdateCartItemQuantityParams): Promise<void> => {
  await api.put('/purchase/cart/quantity', data);
};

// 5. Eliminar un ítem del carrito
export const removeCartItem = async (data: RemoveCartItemParams): Promise<void> => {
  await api.delete('/purchase/cart/item', { data });
};

// 6. Generar factura en PDF
export const generateInvoicePdf = async (orderId: number): Promise<Blob> => {
  const res = await api.get(`/purchase/invoice/${orderId}`, {
    responseType: 'blob', // Importante para descargar archivos
  });
  return res.data;
};