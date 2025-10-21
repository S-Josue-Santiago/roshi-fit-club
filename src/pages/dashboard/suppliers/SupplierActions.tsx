// roshi_fit/src/pages/dashboard/suppliers/SupplierActions.tsx
import React from 'react';
import { Edit3, Power } from 'lucide-react';

interface SupplierActionsProps {
  supplier: { id: number; estado: string };
  onEdit?: (id: number) => void;
  onToggleStatus?: (id: number) => void;
}

const SupplierActions: React.FC<SupplierActionsProps> = ({ supplier, onEdit, onToggleStatus }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onEdit?.(supplier.id)}
        className="p-1 text-dashboard-text hover:text-dashboard-primary"
        title="Editar"
      >
        <Edit3 size={16} />
      </button>
      <button
        onClick={() => onToggleStatus?.(supplier.id)}
        className={`p-1 ${
          supplier.estado === 'activo'
            ? 'text-red-400 hover:text-red-300'
            : 'text-green-400 hover:text-green-300'
        }`}
        title={supplier.estado === 'activo' ? 'Desactivar' : 'Activar'}
      >
        <Power size={16} />
      </button>
    </div>
  );
};

export default SupplierActions;