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
    <div className="flex space-x-1 sm:space-x-2">
      <button
        onClick={() => onEdit?.(equipment.id)}
        className="
          p-2 bg-indigo-600/20 text-indigo-400 rounded-lg
          hover:bg-indigo-600 hover:text-white
          border border-indigo-600/30 hover:border-indigo-400
          transition-all duration-300 transform hover:scale-110
        "
        title="Editar equipo"
      >
        <Edit3 size={16} />
      </button>
      <button
        onClick={() => onToggleStatus?.(equipment.id)}
        className={`
          p-2 rounded-lg border transition-all duration-300 transform hover:scale-110
          ${
            equipment.estado === 'activo'
              ? 'bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600 hover:text-white hover:border-red-400'
              : 'bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600 hover:text-white hover:border-green-400'
          }
        `}
        title={equipment.estado === 'activo' ? 'Desactivar equipo' : 'Activar equipo'}
      >
        <Power size={16} />
      </button>
    </div>
  );
};

export default EquipmentActions;