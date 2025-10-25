// roshi_fit/src/pages/dashboard/gallery/GalleryActions.tsx
import React from 'react';
import { Edit3, Power } from 'lucide-react';

interface GalleryActionsProps {
  item: { id: number; estado: string };
  onEdit?: (id: number) => void;
  onToggleStatus?: (id: number) => void;
}

const GalleryActions: React.FC<GalleryActionsProps> = ({ item, onEdit, onToggleStatus }) => {
  return (
    <div className="flex space-x-1 sm:space-x-2">
      <button
        onClick={() => onEdit?.(item.id)}
        className="
          p-2 bg-pink-600/20 text-pink-400 rounded-lg
          hover:bg-pink-600 hover:text-white
          border border-pink-600/30 hover:border-pink-400
          transition-all duration-300 transform hover:scale-110
        "
        title="Editar item"
      >
        <Edit3 size={16} />
      </button>
      <button
        onClick={() => onToggleStatus?.(item.id)}
        className={`
          p-2 rounded-lg border transition-all duration-300 transform hover:scale-110
          ${
            item.estado === 'activo'
              ? 'bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600 hover:text-white hover:border-red-400'
              : 'bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600 hover:text-white hover:border-green-400'
          }
        `}
        title={item.estado === 'activo' ? 'Desactivar item' : 'Activar item'}
      >
        <Power size={16} />
      </button>
    </div>
  );
};

export default GalleryActions;