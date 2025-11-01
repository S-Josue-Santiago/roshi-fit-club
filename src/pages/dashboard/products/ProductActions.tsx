// roshi_fit/src/pages/dashboard/products/ProductActions.tsx
import React from 'react';
import {  Edit3, Power, Package } from 'lucide-react';

interface ProductActionsProps {
  product: {
    id: number;
    nombre: string;
    stock: number | null;
    estado: string;
  };
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onToggleStatus?: (id: number) => void;
  onManageStock?: (id: number, stock: number, nombre: string) => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  // onView,
  onEdit,
  onToggleStatus,
  onManageStock,
}) => {
  return (
    <div className="flex space-x-1 sm:space-x-2">
      {/* Botón Ver Detalles */}
      {/* <button
        onClick={() => onView?.(product.id)}
        className="
          p-2 sm:p-2 bg-blue-600/20 text-blue-400 rounded-lg
          hover:bg-blue-600 hover:text-white
          border border-blue-600/30 hover:border-blue-400
          transition-all duration-300 transform hover:scale-110
          group relative
        "
        title="Ver detalles"
        aria-label="Ver detalles"
      >
        <Eye size={16} className="sm:w-4 sm:h-4" />

      </button> */}

      {/* Botón Editar */}
      <button
        onClick={() => onEdit?.(product.id)}
        className="
          p-2 sm:p-2 bg-cyan-600/20 text-cyan-400 rounded-lg
          hover:bg-cyan-600 hover:text-white
          border border-cyan-600/30 hover:border-cyan-400
          transition-all duration-300 transform hover:scale-110
          group relative
        "
        title="Editar producto"
        aria-label="Editar producto"
      >
        <Edit3 size={16} className="sm:w-4 sm:h-4" />

      </button>

      {/* Botón Gestionar Stock */}
      <button
        onClick={() => onManageStock?.(product.id, product.stock ?? 0, product.nombre)}
        className="
          p-2 sm:p-2 bg-green-600/20 text-green-400 rounded-lg
          hover:bg-green-600 hover:text-white
          border border-green-600/30 hover:border-green-400
          transition-all duration-300 transform hover:scale-110
          group relative
        "
        title="Gestionar stock"
        aria-label="Gestionar stock"
      >
        <Package size={16} className="sm:w-4 sm:h-4" />

      </button>

      {/* Botón Activar/Desactivar */}
      <button
        onClick={() => onToggleStatus?.(product.id)}
        className={`
          p-2 sm:p-2 rounded-lg border transition-all duration-300 transform hover:scale-110
          group relative
          ${
            product.estado === 'activo'
              ? 'bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600 hover:text-white hover:border-red-400'
              : 'bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600 hover:text-white hover:border-green-400'
          }
        `}
        title={product.estado === 'activo' ? 'Desactivar producto' : 'Activar producto'}
        aria-label={product.estado === 'activo' ? 'Desactivar producto' : 'Activar producto'}
      >
        <Power size={16} className="sm:w-4 sm:h-4" />

      </button>
    </div>
  );
};

export default ProductActions;