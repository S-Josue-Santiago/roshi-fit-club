// roshi_fit/src/pages/dashboard/categories/CategoryActions.tsx
import React from 'react';
import { Edit3, Power } from 'lucide-react';

interface CategoryActionsProps {
  category: { id: number; estado: string };
  onEdit?: (id: number) => void;
  onToggleStatus?: (id: number) => void;
}

const CategoryActions: React.FC<CategoryActionsProps> = ({ category, onEdit, onToggleStatus }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onEdit?.(category.id)}
        className="p-1 text-dashboard-text hover:text-dashboard-primary"
        title="Editar"
      >
        <Edit3 size={16} />
      </button>
      <button
        onClick={() => onToggleStatus?.(category.id)}
        className={`p-1 ${
          category.estado === 'activo'
            ? 'text-red-400 hover:text-red-300'
            : 'text-green-400 hover:text-green-300'
        }`}
        title={category.estado === 'activo' ? 'Desactivar' : 'Activar'}
      >
        <Power size={16} />
      </button>
    </div>
  );
};

export default CategoryActions;