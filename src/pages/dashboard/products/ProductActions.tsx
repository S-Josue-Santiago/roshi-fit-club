// roshi_fit/src/pages/dashboard/products/ProductActions.tsx
import React from 'react';
import { Eye, Edit3, Power, Package } from 'lucide-react';

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
  onView,
  onEdit,
  onToggleStatus,
  onManageStock,
}) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onView?.(product.id)}
        className="p-1 text-dashboard-text hover:text-dashboard-primary"
        title="Ver detalles"
        aria-label="Ver detalles"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={() => onEdit?.(product.id)}
        className="p-1 text-dashboard-text hover:text-dashboard-primary"
        title="Editar"
        aria-label="Editar"
      >
        <Edit3 size={16} />
      </button>
      <button
        onClick={() => onToggleStatus?.(product.id)}
        className={`p-1 ${
          product.estado === 'activo'
            ? 'text-red-400 hover:text-red-300'
            : 'text-green-400 hover:text-green-300'
        }`}
        title={product.estado === 'activo' ? 'Desactivar' : 'Activar'}
        aria-label={product.estado === 'activo' ? 'Desactivar' : 'Activar'}
      >
        <Power size={16} />
      </button>
      <button
        onClick={() => onManageStock?.(product.id, product.stock ?? 0, product.nombre)}
        className="p-1 text-dashboard-text hover:text-dashboard-secondary"
        title="Gestionar stock"
        aria-label="Gestionar stock"
      >
        <Package size={16} />
      </button>
    </div>
  );
};

export default ProductActions;