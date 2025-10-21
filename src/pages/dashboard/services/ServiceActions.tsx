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
    <div className="flex space-x-2">
      <button
        onClick={() => onEdit?.(service.id)}
        className="p-1 text-dashboard-text hover:text-dashboard-primary"
        title="Editar"
      >
        <Edit3 size={16} />
      </button>
      <button
        onClick={() => onToggleStatus?.(service.id)}
        className={`p-1 ${
          service.estado === 'activo'
            ? 'text-red-400 hover:text-red-300'
            : 'text-green-400 hover:text-green-300'
        }`}
        title={service.estado === 'activo' ? 'Desactivar' : 'Activar'}
      >
        <Power size={16} />
      </button>
    </div>
  );
};

export default ServiceActions;