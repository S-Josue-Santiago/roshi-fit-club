// roshi_fit/src/pages/dashboard/subscriptions/PlanActions.tsx
import React from 'react';
import { Edit3, Power } from 'lucide-react';

interface PlanActionsProps {
  plan: { id: number; estado: string }; // Added estado for toggle button logic
  onEdit?: (id: number) => void;
  onToggleStatus?: (id: number) => void; // New prop
}

const PlanActions: React.FC<PlanActionsProps> = ({ plan, onEdit, onToggleStatus }) => {
  return (
    <div className="flex space-x-1 sm:space-x-2">
      <button
        onClick={() => onEdit?.(plan.id)}
        className="
          p-2 bg-teal-600/20 text-teal-400 rounded-lg
          hover:bg-teal-600 hover:text-white
          border border-teal-600/30 hover:border-teal-400
          transition-all duration-300 transform hover:scale-110
        "
        title="Editar plan"
      >
        <Edit3 size={16} />
      </button>
      {/* Botón Activar/Desactivar */}
      <button
        onClick={() => onToggleStatus?.(plan.id)}
        className={`
          p-2 sm:p-2 rounded-lg border transition-all duration-300 transform hover:scale-110
          group relative
          ${
            (plan as any).estado === 'activo' // Type assertion as 'estado' is not in Plan type yet
              ? 'bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600 hover:text-white hover:border-red-400'
              : 'bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600 hover:text-white hover:border-green-400'
          }
        `}
        title={(plan as any).estado === 'activo' ? 'Desactivar plan' : 'Activar plan'}
        aria-label={(plan as any).estado === 'activo' ? 'Desactivar plan' : 'Activar plan'}
      >
        <Power size={16} className="sm:w-4 sm:h-4" />
      </button>
    </div>
  );
};

export default PlanActions;