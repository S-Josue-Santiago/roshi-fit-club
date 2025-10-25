// roshi_fit/src/pages/dashboard/services/ServiceActions.tsx
import React from 'react';
import { Edit3, Power } from 'lucide-react';

interface ServiceActionsProps {
  service: { id: number; estado: string };
  onEdit?: (id: number) => void;
  onToggleStatus?: (id: number) => void;
}

const ServiceActions: React.FC<ServiceActionsProps> = ({ service, onEdit, onToggleStatus }) => {
  return (
    <div className="flex space-x-1 sm:space-x-2">
      <button
        onClick={() => onEdit?.(service.id)}
        className="
          p-2 bg-purple-600/20 text-purple-400 rounded-lg
          hover:bg-purple-600 hover:text-white
          border border-purple-600/30 hover:border-purple-400
          transition-all duration-300 transform hover:scale-110
        "
        title="Editar servicio"
      >
        <Edit3 size={16} />
      </button>
      <button
        onClick={() => onToggleStatus?.(service.id)}
        className={`
          p-2 rounded-lg border transition-all duration-300 transform hover:scale-110
          ${
            service.estado === 'activo'
              ? 'bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600 hover:text-white hover:border-red-400'
              : 'bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600 hover:text-white hover:border-green-400'
          }
        `}
        title={service.estado === 'activo' ? 'Desactivar servicio' : 'Activar servicio'}
      >
        <Power size={16} />
      </button>
    </div>
  );
};

export default ServiceActions;