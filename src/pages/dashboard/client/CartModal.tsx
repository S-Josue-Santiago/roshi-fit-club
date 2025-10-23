// roshi_fit/src/pages/dashboard/client/CartModal.tsx
import React, { useState, useEffect } from 'react';
import { getCart, checkout } from '../../../api/purchaseApi';
import type { CartResponse } from '../../../types/Purchase';
import CheckoutForm from './CheckoutForm';

interface CartModalProps {
  usuarioId: number;
  onClose: () => void;
  onCheckoutSuccess: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ usuarioId, onClose, onCheckoutSuccess }) => {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckout, setIsCheckout] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await getCart(usuarioId);
        setCart(data);
      } catch (err) {
        setError('Error al cargar el carrito.');
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [usuarioId]);

  const handleCheckout = async (checkoutData: any) => {
    try {
      await checkout(checkoutData);
      onCheckoutSuccess();
      onClose();
    } catch (err) {
      alert('Error al procesar la compra.');
    }
  };

  if (isCheckout) {
    return <CheckoutForm usuarioId={usuarioId} onBack={() => setIsCheckout(false)} onCheckout={handleCheckout} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-dashboard-accent/90 p-6 rounded-xl shadow-2xl w-full max-w-2xl border border-dashboard-accent" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 border-b border-dashboard-accent pb-2">
          <h2 className="text-xl font-bold text-dashboard-text">Carrito de Compras</h2>
          <button onClick={onClose} className="text-dashboard-text hover:text-dashboard-primary text-2xl">&times;</button>
        </div>

        {loading ? (
          <p className="text-dashboard-text">Cargando carrito...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : !cart || cart.items.length === 0 ? (
          <p className="text-dashboard-text">Tu carrito está vacío.</p>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center py-3 border-b border-dashboard-accent/30">
                  <img
                    src={`/assets/products/${item.productos.imagen_principal || 'placeholder.jpg'}`}
                    alt={item.productos.nombre}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-dashboard-text">{item.productos.nombre}</h3>
                    <p className="text-dashboard-primary font-bold">
                      Q{parseFloat(item.productos.precio_venta_q.toString()).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-dashboard-text">x{item.cantidad}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-dashboard-accent">
              <div className="flex justify-between text-lg font-bold text-dashboard-text">
                <span>Total:</span>
                <span className="text-dashboard-primary">Q{cart.total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setIsCheckout(true)}
                className="w-full mt-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded hover:bg-dashboard-secondary transition-colors"
              >
                Proceder al Pago
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;