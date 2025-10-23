// roshi_fit/src/pages/dashboard/client/products/ProductCard.tsx
import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
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

  return (
    <div className="bg-dashboard-accent/30 rounded-xl overflow-hidden border border-dashboard-accent">
      <div className="h-48 bg-dashboard-bg flex items-center justify-center">
        {producto.imagen_principal ? (
          <img
            src={`/assets/products/${producto.imagen_principal}`}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-dashboard-text">Sin imagen</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-dashboard-text">{producto.nombre}</h3>
        <p className="text-sm text-dashboard-text-secondary mt-1 line-clamp-2">
          {producto.descripcion || 'Sin descripción'}
        </p>
        <p className="text-lg font-bold text-dashboard-primary mt-2">
          {formatPrice(producto.precio_venta_q)}
        </p>
        <div className="mt-3 flex items-center space-x-2">
          <input
            type="number"
            min="1"
            max={producto.stock || 999}
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 p-1 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
          />
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="flex-1 flex items-center justify-center space-x-1 py-1 bg-dashboard-primary text-dashboard-bg rounded hover:bg-dashboard-secondary transition-colors"
          >
            {loading ? 'Añadiendo...' : <><ShoppingCart size={16} /> Añadir</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;