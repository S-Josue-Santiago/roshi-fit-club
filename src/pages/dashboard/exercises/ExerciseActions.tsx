// roshi_fit/src/pages/dashboard/exercises/ExerciseActions.tsx
import React from 'react';
import { Edit3 } from 'lucide-react';

interface ExerciseActionsProps {
  exercise: { id: number };
  onEdit?: (id: number) => void;
}

const ExerciseActions: React.FC<ExerciseActionsProps> = ({ exercise, onEdit }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onEdit?.(exercise.id)}
        className="p-1 text-dashboard-text hover:text-dashboard-primary"
        title="Editar"
      >
        <Edit3 size={16} />
      </button>
    </div>
  );
};

export default ExerciseActions;