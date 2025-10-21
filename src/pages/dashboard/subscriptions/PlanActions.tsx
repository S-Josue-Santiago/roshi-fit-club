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
        className="p-1 text-dashboard-text hover:text-dashboard-primary"
        title="Editar"
      >
        <Edit3 size={16} />
      </button>
    </div>
  );
};

export default PlanActions;