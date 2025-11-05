// roshi_fit/src/pages/dashboard/client/products/ProductCard.tsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Package, AlertCircle } from 'lucide-react'; //, CheckCircle, TrendingUp
import { addToCart } from '../../../../api/purchaseApi';

interface ProductCardProps {
  producto: {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio_venta_q: number;
    imagen_principal: string | null;
    stock: number | null;
  };
  usuarioId: number;
  onAddToCart: () => void;
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

const ProductCard: React.FC<ProductCardProps> = ({ producto, usuarioId, onAddToCart }) => {
  const theme = useDashboardThemeDetection();
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async () => {
    if (producto.stock !== null && cantidad > producto.stock) {
      alert('Stock insuficiente.');
      return;
    }

    setLoading(true);
    try {
      await addToCart({
        usuario_id: usuarioId,
        producto_id: producto.id,
        cantidad
      });
      onAddToCart();
      setCantidad(1);
    } catch (error) {
      alert('Error al agregar al carrito.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (precio: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(precio);
  };

  const incrementQuantity = () => {
    const maxStock = producto.stock || 999;
    setCantidad(prev => Math.min(prev + 1, maxStock));
  };

  const decrementQuantity = () => {
    setCantidad(prev => Math.max(1, prev - 1));
  };

  // const getStockStatus = () => {
  //   if (producto.stock === null) return { 
  //     text: 'Disponible', 
  //     color: theme === 'amanecer' ? 'text-green-700' : 'text-green-400', 
  //     bg: theme === 'amanecer' ? 'bg-green-100' : 'bg-green-500/20',
  //     border: theme === 'amanecer' ? 'border-green-400' : 'border-green-500'
  //   };
  //   if (producto.stock === 0) return { 
  //     text: 'Agotado', 
  //     color: theme === 'amanecer' ? 'text-red-700' : 'text-red-400', 
  //     bg: theme === 'amanecer' ? 'bg-red-100' : 'bg-red-500/20',
  //     border: theme === 'amanecer' ? 'border-red-400' : 'border-red-500'
  //   };
  //   if (producto.stock <= 5) return { 
  //     text: `Últimas ${producto.stock}`, 
  //     color: theme === 'amanecer' ? 'text-yellow-700' : 'text-yellow-400', 
  //     bg: theme === 'amanecer' ? 'bg-yellow-100' : 'bg-yellow-500/20',
  //     border: theme === 'amanecer' ? 'border-yellow-400' : 'border-yellow-500'
  //   };
  //   return { 
  //     text: 'En Stock', 
  //     color: theme === 'amanecer' ? 'text-green-700' : 'text-green-400', 
  //     bg: theme === 'amanecer' ? 'bg-green-100' : 'bg-green-500/20',
  //     border: theme === 'amanecer' ? 'border-green-400' : 'border-green-500'
  //   };
  // };

  // const stockStatus = getStockStatus();
  const isOutOfStock = producto.stock === 0;

  // Estilos según tema
  const getStyles = () => {
    if (theme === 'amanecer') {
      return {
        card: 'bg-white border-slate-300 hover:border-blue-400',
        cardShadow: '0 10px 30px rgba(74, 144, 226, 0.15)',
        imageBg: 'bg-gradient-to-br from-slate-100 to-slate-200',
        imageOverlay: 'from-white/80 to-transparent',
        imageIcon: 'text-gray-400',
        title: 'text-gray-900 group-hover:text-blue-600',
        description: 'text-gray-600',
        price: 'text-blue-600',
        stockBadge: 'bg-slate-100 text-gray-700 border-slate-300',
        quantityLabel: 'text-gray-800',
        quantityButton: 'border-slate-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50',
        quantityNumber: 'text-gray-900',
        addButton: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
        addButtonShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
        disabledButton: 'from-gray-400 to-gray-500'
      };
    }
    
    // Tema Nocturno
    return {
      card: 'bg-[#16213E]/50 border-purple-500/30 hover:border-cyan-500',
      cardShadow: '0 10px 30px rgba(138, 43, 226, 0.2)',
      imageBg: 'bg-gradient-to-br from-[#0A0E27] to-[#16213E]',
      imageOverlay: 'from-black/80 to-transparent',
      imageIcon: 'text-purple-500/50',
      title: 'text-white group-hover:text-cyan-400',
      description: 'text-[#B0BEC5]',
      price: 'text-cyan-400',
      stockBadge: 'bg-[#0A0E27]/80 text-[#B0BEC5] border-purple-500/30',
      quantityLabel: 'text-white',
      quantityButton: 'border-purple-500/30 text-white hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10',
      quantityNumber: 'text-white',
      addButton: 'bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800',
      addButtonShadow: '0 8px 20px rgba(34, 211, 238, 0.4)',
      disabledButton: 'from-gray-600 to-gray-700'
    };
  };

  const styles = getStyles();

  return (
    <div 
      className={`
        ${styles.card} rounded-3xl overflow-hidden border-2
        transition-all duration-500 transform hover:scale-105
        group relative
      `}
      style={{ boxShadow: styles.cardShadow }}
    >
      {/* Badge de stock
      <div className={`
        absolute top-4 right-4 z-10 px-3 py-1.5 rounded-xl text-xs font-black border-2
        ${stockStatus.bg} ${stockStatus.color} ${stockStatus.border}
        shadow-lg backdrop-blur-sm
        flex items-center gap-1
      `}>
        {producto.stock === 0 ? (
          <AlertCircle size={14} />
        ) : producto.stock && producto.stock <= 5 ? (
          <TrendingUp size={14} />
        ) : (
          <CheckCircle size={14} />
        )}
        {stockStatus.text}
      </div> */}

      {/* Imagen del producto */}
      <div className="h-56 relative overflow-hidden">
        {producto.imagen_principal && !imageError ? (
          <>
            <img
              src={`/assets/products/${producto.imagen_principal}`}
              alt={producto.nombre}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
            {/* Overlay gradiente */}
            <div className={`absolute inset-0  ${styles.imageOverlay} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </>
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center ${styles.imageBg}`}>
            <Package size={56} className={`mb-3 ${styles.imageIcon}`} />
            <span className={`text-sm font-semibold ${styles.imageIcon}`}>Sin imagen</span>
          </div>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-6">
        {/* Nombre */}
        <h3 className={`font-black text-lg mb-2 transition-colors line-clamp-1 ${styles.title}`}>
          {producto.nombre}
        </h3>
        
        {/* Descripción */}
        <p className={`text-sm mb-4 line-clamp-2 leading-relaxed ${styles.description}`}>
          {producto.descripcion || 'Producto de alta calidad para tu entrenamiento'}
        </p>

        {/* Precio y stock */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: theme === 'amanecer' ? '#6b7280' : '#B0BEC5' }}>
              PRECIO
            </p>
            <span className={`text-3xl font-black ${styles.price}`}>
              {formatPrice(producto.precio_venta_q)}
            </span>
          </div>
          {/* {producto.stock !== null && producto.stock > 0 && (
            <div className={`px-3 py-2 rounded-xl text-xs font-bold ${styles.stockBadge} border`}>
              <p className="text-[10px] mb-0.5 opacity-70">STOCK</p>
              <p className="text-lg font-black">{producto.stock}</p>
            </div>
          )} */}
        </div>

        {/* Controles de cantidad y carrito */}
        <div className="space-y-4">
          {/* Selector de cantidad */}
          <div className="flex items-center justify-between">
            <label className={`text-xs font-black ${styles.quantityLabel}`}>CANTIDAD:</label>
            <div className="flex items-center gap-2">
              <button
                onClick={decrementQuantity}
                disabled={cantidad <= 1 || isOutOfStock}
                className={`
                  p-2 rounded-xl border-2 transition-all duration-300
                  disabled:opacity-30 disabled:cursor-not-allowed
                  transform hover:scale-110 active:scale-95
                  ${styles.quantityButton}
                `}
              >
                <Minus size={16} />
              </button>
              
              <span className={`w-14 text-center font-black text-xl ${styles.quantityNumber}`}>
                {cantidad}
              </span>
              
              <button
                onClick={incrementQuantity}
                disabled={isOutOfStock || (producto.stock !== null && cantidad >= producto.stock)}
                className={`
                  p-2 rounded-xl border-2 transition-all duration-300
                  disabled:opacity-30 disabled:cursor-not-allowed
                  transform hover:scale-110 active:scale-95
                  ${styles.quantityButton}
                `}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Botón agregar al carrito */}
          <button
            onClick={handleAddToCart}
            disabled={loading || isOutOfStock}
            className={`
              w-full py-4 text-white font-black rounded-2xl 
              ${loading || isOutOfStock ? styles.disabledButton : styles.addButton}
              disabled:cursor-not-allowed
              transition-all duration-300 transform hover:scale-105 active:scale-95
              flex items-center justify-center gap-2
              group/btn text-sm
            `}
            style={{ boxShadow: loading || isOutOfStock ? 'none' : styles.addButtonShadow }}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                AGREGANDO...
              </>
            ) : isOutOfStock ? (
              <>
                <AlertCircle size={18} />
                AGOTADO
              </>
            ) : (
              <>
                <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
                AGREGAR AL CARRITO
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;