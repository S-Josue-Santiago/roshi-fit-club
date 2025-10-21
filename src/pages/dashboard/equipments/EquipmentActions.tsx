// roshi_fit/src/pages/dashboard/equipment/EquipmentActions.tsx
import React from 'react';
import { Edit3, Power } from 'lucide-react';

interface EquipmentActionsProps {
  equipment: { id: number; estado: string };
  onEdit?: (id: number) => void;
  onToggleStatus?: (id: number) => void;
}

const EquipmentActions: React.FC<EquipmentActionsProps> = ({ equipment, onEdit, onToggleStatus }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onEdit?.(equipment.id)}
        className="p-1 text-dashboard-text hover:text-dashboard-primary"
        title="Editar"
      >
        <Edit3 size={16} />
      </button>
      <button
        onClick={() => onToggleStatus?.(equipment.id)}
        className={`p-1 ${
          equipment.estado === 'activo'
            ? 'text-red-400 hover:text-red-300'
            : 'text-green-400 hover:text-green-300'
        }`}
        title={equipment.estado === 'activo' ? 'Desactivar' : 'Activar'}
      >
        <Power size={16} />
      </button>
    </div>
  );
};

export default EquipmentActions;