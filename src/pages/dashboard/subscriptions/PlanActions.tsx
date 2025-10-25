// roshi_fit/src/pages/dashboard/subscriptions/PlanActions.tsx
import React from 'react';
import { Edit3 } from 'lucide-react';

interface PlanActionsProps {
  plan: { id: number };
  onEdit?: (id: number) => void;
}

const PlanActions: React.FC<PlanActionsProps> = ({ plan, onEdit }) => {
  return (
    <div className="flex space-x-2">
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
    </div>
  );
};

export default PlanActions;