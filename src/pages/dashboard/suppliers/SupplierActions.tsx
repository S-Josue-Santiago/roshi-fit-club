// roshi_fit/src/pages/dashboard/suppliers/SupplierActions.tsx
import React from 'react';
import { Edit3, Power } from 'lucide-react';

interface SupplierActionsProps {
  supplier: { id: number; estado: string };
  onEdit?: (id: number) => void;
  onToggleStatus?: (id: number) => void; // Reverted to original signature
}

const SupplierActions: React.FC<SupplierActionsProps> = ({ supplier, onEdit, onToggleStatus }) => {
  return (
    <div className="flex space-x-1 sm:space-x-2">
      {/* Botón Editar */}
      <button
        onClick={() => onEdit?.(supplier.id)}
        className="
          p-2 sm:p-2 bg-orange-600/20 text-orange-400 rounded-lg
          hover:bg-orange-600 hover:text-white
          border border-orange-600/30 hover:border-orange-400
          transition-all duration-300 transform hover:scale-110
          group relative
        "
        title="Editar proveedor"
      >
        <Edit3 size={16} className="sm:w-4 sm:h-4" />

      </button>

      {/* Botón Activar/Desactivar */}
      <button
        onClick={() => onToggleStatus?.(supplier.id)}
        className={`
          p-2 sm:p-2 rounded-lg border transition-all duration-300 transform hover:scale-110
          group relative
          ${
            supplier.estado === 'activo'
              ? 'bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600 hover:text-white hover:border-red-400'
              : 'bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600 hover:text-white hover:border-green-400'
          }
        `}
        title={supplier.estado === 'activo' ? 'Desactivar proveedor' : 'Activar proveedor'}
      >
        <Power size={16} className="sm:w-4 sm:h-4" />

      </button>
    </div>
  );
};

export default SupplierActions;