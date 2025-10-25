// roshi_fit/src/pages/dashboard/client/products/ProductCard.tsx
import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Package, AlertCircle } from 'lucide-react';
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

const ProductCard: React.FC<ProductCardProps> = ({ producto, usuarioId, onAddToCart }) => {
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
      // Reset cantidad después de agregar
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

  const getStockStatus = () => {
    if (producto.stock === null) return { text: 'Disponible', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (producto.stock === 0) return { text: 'Agotado', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (producto.stock <= 5) return { text: `Últimas ${producto.stock} unidades`, color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { text: 'En stock', color: 'text-green-400', bg: 'bg-green-500/20' };
  };

  const stockStatus = getStockStatus();
  const isOutOfStock = producto.stock === 0;

  return (
    <div className="
      bg-dashboard-accent/30 rounded-2xl overflow-hidden border-2 border-dashboard-accent/50
      shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105
      group relative
    ">
      {/* Badge de stock */}
      <div className={`
        absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold border
        ${stockStatus.bg} ${stockStatus.color} border-current
      `}>
        {stockStatus.text}
      </div>

      {/* Imagen del producto */}
      <div className="h-48 bg-dashboard-bg/50 relative overflow-hidden">
        {producto.imagen_principal && !imageError ? (
          <img
            src={`/assets/products/${producto.imagen_principal}`}
            alt={producto.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-dashboard-text-secondary bg-gradient-to-br from-dashboard-accent to-dashboard-accent/70">
            <Package size={48} className="mb-2 opacity-50" />
            <span className="text-sm">Imagen no disponible</span>
          </div>
        )}
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-5">
        {/* Nombre y descripción */}
        <h3 className="font-black text-dashboard-text text-lg mb-2 group-hover:text-cyan-300 transition-colors line-clamp-1">
          {producto.nombre}
        </h3>
        
        <p className="text-sm text-dashboard-text-secondary mb-4 line-clamp-2 leading-relaxed">
          {producto.descripcion || 'Descripción no disponible'}
        </p>

        {/* Precio */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-black text-cyan-400">
            {formatPrice(producto.precio_venta_q)}
          </span>
          {producto.stock !== null && producto.stock > 0 && (
            <span className="text-xs text-dashboard-text-secondary bg-dashboard-accent/50 px-2 py-1 rounded">
              Stock: {producto.stock}
            </span>
          )}
        </div>

        {/* Controles de cantidad y carrito */}
        <div className="space-y-3">
          {/* Selector de cantidad */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-dashboard-text">CANTIDAD:</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={decrementQuantity}
                disabled={cantidad <= 1 || isOutOfStock}
                className="
                  p-1 rounded-lg border border-dashboard-accent/50 
                  hover:border-cyan-400 hover:text-cyan-400 
                  disabled:opacity-30 disabled:cursor-not-allowed
                  transition-all duration-200
                "
              >
                <Minus size={16} />
              </button>
              
              <span className="w-12 text-center font-bold text-dashboard-text text-lg">
                {cantidad}
              </span>
              
              <button
                onClick={incrementQuantity}
                disabled={isOutOfStock || (producto.stock !== null && cantidad >= producto.stock)}
                className="
                  p-1 rounded-lg border border-dashboard-accent/50 
                  hover:border-cyan-400 hover:text-cyan-400 
                  disabled:opacity-30 disabled:cursor-not-allowed
                  transition-all duration-200
                "
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Botón agregar al carrito */}
          <button
            onClick={handleAddToCart}
            disabled={loading || isOutOfStock}
            className="
              w-full py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 
              text-white font-bold rounded-xl 
              hover:from-cyan-700 hover:to-cyan-800
              disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
              transition-all duration-300 transform hover:scale-105
              flex items-center justify-center gap-2
              group/btn
            "
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
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