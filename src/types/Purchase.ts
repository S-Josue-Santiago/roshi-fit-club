// roshi_fit/src/types/Purchase.ts
export interface CartItem {
  id: number;
  cantidad: number;
  productos: { // ← ¡No "producto"!
    id: number;
    nombre: string;
    descripcion: string | null;
    precio_venta_q: number;
    imagen_principal: string | null;
    stock: number | null;
  };
}

export interface AddToCartParams {
  usuario_id: number;
  producto_id: number;
  cantidad: number;
}

export interface CheckoutParams {
  usuario_id: number;
  tipo_entrega: 'retiro' | 'domicilio';
  direccion_entrega?: string;
  metodo_pago_id: number;
  detalles_pago?: Record<string, any>;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}