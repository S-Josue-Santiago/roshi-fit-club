// roshi_fit/src/pages/dashboard/exercises/ExerciseActions.tsx
import React from 'react';
import { Edit3 } from 'lucide-react';

interface ExerciseActionsProps {
  exercise: { id: number };
  onEdit?: (id: number) => void;
}

const ExerciseActions: React.FC<ExerciseActionsProps> = ({ exercise, onEdit }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onEdit?.(exercise.id)}
        className="
          p-2 bg-blue-600/20 text-blue-400 rounded-lg
          hover:bg-blue-600 hover:text-white
          border border-blue-600/30 hover:border-blue-400
          transition-all duration-300 transform hover:scale-110
        "
        title="Editar Ejercicio"
      >
        <Edit3 size={16} />
      </button>
    </div>
  );
};

export default ExerciseActions;