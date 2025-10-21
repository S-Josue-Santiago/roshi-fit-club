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
    <div className="flex space-x-2">
      <button
        onClick={() => onEdit?.(item.id)}
        className="p-1 text-dashboard-text hover:text-dashboard-primary"
        title="Editar"
      >
        <Edit3 size={16} />
      </button>
      <button
        onClick={() => onToggleStatus?.(item.id)}
        className={`p-1 ${
          item.estado === 'activo'
            ? 'text-red-400 hover:text-red-300'
            : 'text-green-400 hover:text-green-300'
        }`}
        title={item.estado === 'activo' ? 'Desactivar' : 'Activar'}
      >
        <Power size={16} />
      </button>
    </div>
  );
};

export default GalleryActions;