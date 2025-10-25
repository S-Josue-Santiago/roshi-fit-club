// roshi_fit/src/pages/dashboard/client/CartModal.tsx
import React, { useState, useEffect } from 'react';
import { getCart, checkout } from '../../../api/purchaseApi';
import type { CartResponse } from '../../../types/Purchase';
import CheckoutForm from './CheckoutForm';
import { ShoppingCart, X, Trash2, Plus, Minus, CreditCard, AlertCircle, Package } from 'lucide-react';

interface CartModalProps {
  usuarioId: number;
  onClose: () => void;
  onCheckoutSuccess: () => void;
}

// Hook para detectar el tema del dashboard
const useDashboardThemeDetection = () => {
  const [detectedTheme, setDetectedTheme] = useState<'nocturno' | 'amanecer'>('nocturno');

  useEffect(() => {
    const checkTheme = () => {
      const bodyClass = document.body.className;
      if (bodyClass.includes('theme-dashboard-amanecer')) {
        setDetectedTheme('amanecer');
      } else {
        setDetectedTheme('nocturno');
      }
    };

    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return detectedTheme;
};

const CartModal: React.FC<CartModalProps> = ({ usuarioId, onClose, onCheckoutSuccess }) => {
  const theme = useDashboardThemeDetection();
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

  // Estilos según tema
  const getStyles = () => {
    if (theme === 'amanecer') {
      return {
        overlay: 'bg-black/40',
        modal: 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-300',
        modalShadow: '0 25px 50px rgba(74, 144, 226, 0.25)',
        header: 'border-slate-300',
        headerTitle: 'text-gray-900',
        closeButton: 'text-gray-600 hover:text-red-600 hover:bg-red-50',
        itemCard: 'bg-white border-slate-200 hover:border-blue-400',
        itemTitle: 'text-gray-900',
        itemPrice: 'text-blue-600',
        itemQuantity: 'text-gray-700 bg-slate-100',
        quantityButton: 'bg-white border-slate-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600',
        deleteButton: 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100 hover:border-red-400',
        totalContainer: 'border-slate-300 bg-gradient-to-r from-blue-50 to-purple-50',
        totalLabel: 'text-gray-800',
        totalAmount: 'text-blue-600',
        checkoutButton: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700',
        checkoutButtonShadow: '0 8px 20px rgba(74, 144, 226, 0.4)',
        emptyText: 'text-gray-600',
        emptyIcon: 'text-gray-400',
        loadingText: 'text-gray-600',
        errorContainer: 'bg-red-50 border-red-300 text-red-700'
      };
    }
    
    // Tema Nocturno
    return {
      overlay: 'bg-black/60',
      modal: 'bg-gradient-to-br from-[#0A0E27] via-[#16213E] to-[#0A0E27] border-purple-500/30',
      modalShadow: '0 25px 50px rgba(138, 43, 226, 0.3)',
      header: 'border-purple-500/30',
      headerTitle: 'text-white',
      closeButton: 'text-white hover:text-red-400 hover:bg-red-500/20',
      itemCard: 'bg-[#16213E]/50 border-purple-500/20 hover:border-[#FFD700]',
      itemTitle: 'text-white',
      itemPrice: 'text-[#FFD700]',
      itemQuantity: 'text-white bg-[#0A0E27]/50',
      quantityButton: 'bg-[#16213E] border-purple-500/30 text-white hover:bg-purple-900 hover:border-[#FFD700] hover:text-[#FFD700]',
      deleteButton: 'bg-red-900/20 border-red-500/40 text-red-400 hover:bg-red-900/40 hover:border-red-500/60',
      totalContainer: 'border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-[#16213E]/50',
      totalLabel: 'text-white',
      totalAmount: 'text-[#FFD700]',
      checkoutButton: 'bg-gradient-to-r from-purple-900 to-purple-700 text-white hover:from-purple-800 hover:to-purple-600',
      checkoutButtonShadow: '0 8px 20px rgba(138, 43, 226, 0.5)',
      emptyText: 'text-[#B0BEC5]',
      emptyIcon: 'text-purple-500/50',
      loadingText: 'text-[#B0BEC5]',
      errorContainer: 'bg-red-900/20 border-red-500/40 text-red-300'
    };
  };

  const styles = getStyles();

  if (isCheckout) {
    return <CheckoutForm usuarioId={usuarioId} onBack={() => setIsCheckout(false)} onCheckout={handleCheckout} />;
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center ${styles.overlay} backdrop-blur-md min-h-screen`}
      onClick={onClose}
    >
      <div 
        className={`${styles.modal} p-6 md:p-8 rounded-3xl w-full max-w-3xl border-2 max-h-[90vh] flex flex-col animate-fadeIn overflow-y-auto`}
        style={{ boxShadow: styles.modalShadow }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex justify-between items-center mb-6 pb-4 border-b-2 ${styles.header}`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${theme === 'amanecer' ? 'bg-blue-100' : 'bg-purple-900/30'}`}>
              <ShoppingCart size={24} className={theme === 'amanecer' ? 'text-blue-600' : 'text-[#FFD700]'} />
            </div>
            <div>
              <h2 className={`text-2xl font-black ${styles.headerTitle}`}>Carrito de Compras</h2>
              <p className={`text-sm ${styles.emptyText}`}>
                {cart?.items.length || 0} {cart?.items.length === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-90 ${styles.closeButton}`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent" 
                   style={{ borderColor: theme === 'amanecer' ? '#3b82f6' : '#8b5cf6', borderTopColor: 'transparent' }}></div>
              <p className={`mt-4 ${styles.loadingText} font-semibold`}>Cargando carrito...</p>
            </div>
          ) : error ? (
            <div className={`flex items-start gap-3 p-4 rounded-2xl border-2 ${styles.errorContainer}`}>
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <p className="font-semibold">{error}</p>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Package size={64} className={`${styles.emptyIcon} mb-4`} />
              <p className={`text-lg font-bold ${styles.emptyText}`}>Tu carrito está vacío</p>
              <p className={`text-sm ${styles.emptyText} mt-2`}>Agrega productos para comenzar tu compra</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div 
                  key={item.id} 
                  className={`
                    flex items-center gap-4 p-4 rounded-2xl border-2
                    ${styles.itemCard}
                    transition-all duration-300 transform hover:scale-[1.02]
                  `}
                >
                  {/* Imagen del producto */}
                  <div className="relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden">
                    <img
                      src={`/assets/products/${item.productos.imagen_principal || 'placeholder.jpg'}`}
                      alt={item.productos.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/placeholder.jpg';
                      }}
                    />
                  </div>

                  {/* Info del producto */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-base md:text-lg ${styles.itemTitle} truncate`}>
                      {item.productos.nombre}
                    </h3>
                    <p className={`font-black text-lg md:text-xl ${styles.itemPrice} mt-1`}>
                      Q{parseFloat(item.productos.precio_venta_q.toString()).toFixed(2)}
                    </p>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center gap-2">
                    <button
                      className={`p-2 rounded-lg border-2 transition-all duration-300 ${styles.quantityButton}`}
                      title="Disminuir cantidad"
                    >
                      <Minus size={16} />
                    </button>
                    <span className={`font-bold text-lg px-4 py-2 rounded-lg ${styles.itemQuantity}`}>
                      {item.cantidad}
                    </span>
                    <button
                      className={`p-2 rounded-lg border-2 transition-all duration-300 ${styles.quantityButton}`}
                      title="Aumentar cantidad"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Botón eliminar */}
                  <button
                    className={`p-2 rounded-lg border-2 transition-all duration-300 transform hover:scale-110 ${styles.deleteButton}`}
                    title="Eliminar producto"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con total y botón de pago */}
        {cart && cart.items.length > 0 && (
          <div className={`mt-6 pt-6 border-t-2 ${styles.totalContainer} rounded-2xl p-4 space-y-4`}>
            <div className="flex justify-between items-center">
              <span className={`text-xl font-bold ${styles.totalLabel}`}>Total a Pagar:</span>
              <span className={`text-3xl font-black ${styles.totalAmount}`}>
                Q{cart.total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => setIsCheckout(true)}
              className={`
                w-full py-4 rounded-2xl font-black text-lg
                ${styles.checkoutButton}
                transition-all duration-300 transform hover:scale-105
                flex items-center justify-center gap-2
                border-2 border-transparent
              `}
              style={{ boxShadow: styles.checkoutButtonShadow }}
            >
              <CreditCard size={20} />
              Proceder al Pago
            </button>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'amanecer' ? 'rgba(226, 232, 240, 0.5)' : 'rgba(22, 33, 62, 0.5)'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'amanecer' ? 'rgba(74, 144, 226, 0.5)' : 'rgba(138, 43, 226, 0.5)'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'amanecer' ? 'rgba(74, 144, 226, 0.8)' : 'rgba(138, 43, 226, 0.8)'};
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CartModal;