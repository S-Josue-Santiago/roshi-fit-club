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
    <div className="flex gap-2">
      <button
        onClick={() => onEdit?.(category.id)}
        className="
          p-2 bg-green-600/20 text-green-400 rounded-lg
          hover:bg-green-600 hover:text-white
          border border-green-600/30 hover:border-green-400
          transition-all duration-300 transform hover:scale-110
        "
        title="Editar Categoría"
      >
        <Edit3 size={16} />
      </button>
      <button
        onClick={() => onToggleStatus?.(category.id)}
        className={`
          p-2 rounded-lg border transition-all duration-300 transform hover:scale-110
          ${
          category.estado === 'activo'
            ? 'bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600 hover:text-white hover:border-red-400'
            : 'bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600 hover:text-white hover:border-green-400'
          }
        }`}
        title={category.estado === 'activo' ? 'Desactivar' : 'Activar'}
      >
        <Power size={16} />
      </button>
    </div>
  );
};

export default CategoryActions;