// roshi_fit/src/pages/dashboard/client/my-training/TrainingExerciseCard.tsx
import React from 'react';
import { CheckCircle, Circle, Calendar, Clock, Target, MessageSquare } from 'lucide-react';
import type { TrainingExercise } from '../../../../types/Training';
import { updateExerciseStatus } from '../../../../api/trainingApi';

interface TrainingExerciseCardProps {
  exercise: TrainingExercise;
  onStatusChange: () => void;
}

const TrainingExerciseCard: React.FC<TrainingExerciseCardProps> = ({ exercise, onStatusChange }) => {
  const isCompleted = exercise.estado === 'activo';

  const handleToggle = async () => {
    const newStatus = isCompleted ? 'desabilitado' : 'activo';
    try {
      await updateExerciseStatus(exercise.id, newStatus);
      onStatusChange();
    } catch (error) {
      console.error('Error al actualizar el estado del ejercicio:', error);
    }
  };

  const getDayName = (day: string | null) => {
    const days: Record<string, string> = {
      lunes: 'Lunes',
      martes: 'Martes',
      miercoles: 'Miércoles',
      jueves: 'Jueves',
      viernes: 'Viernes',
      sabado: 'Sábado',
      domingo: 'Domingo'
    };
    return day ? days[day] || day : '—';
  };

  return (
    <div className={`
      bg-dashboard-accent/30 p-5 rounded-xl border-2 transition-all duration-300
      ${isCompleted 
        ? 'border-green-500/30 bg-green-500/10' 
        : 'border-dashboard-accent/50 hover:border-cyan-400/50 hover:bg-dashboard-accent/40'
      }
      group hover:scale-105 hover:shadow-lg
    `}>
      <div className="flex items-start justify-between gap-4">
        {/* Contenido principal */}
        <div className="flex-1">
          {/* Header con nombre y día */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h3 className={`font-black text-lg ${
              isCompleted ? 'text-green-400 line-through' : 'text-dashboard-text group-hover:text-cyan-300'
            } transition-colors`}>
              {exercise.ejercicios.nombre}
            </h3>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={14} className="text-dashboard-text-secondary" />
              <span className="text-dashboard-text-secondary font-medium">
                {getDayName(exercise.dia_semana)}
              </span>
            </div>
          </div>

          {/* Detalles del ejercicio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            {exercise.series && (
              <div className="flex items-center gap-2">
                <Target size={14} className="text-cyan-400" />
                <span className="text-dashboard-text text-sm font-semibold">
                  Series: <span className="text-cyan-400">{exercise.series}</span>
                </span>
              </div>
            )}
            
            {exercise.repeticiones && (
              <div className="flex items-center gap-2">
                <Circle size={14} className="text-cyan-400" />
                <span className="text-dashboard-text text-sm font-semibold">
                  Reps: <span className="text-cyan-400">{exercise.repeticiones}</span>
                </span>
              </div>
            )}
            
            {exercise.descanso_segundos && (
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-cyan-400" />
                <span className="text-dashboard-text text-sm font-semibold">
                  Descanso: <span className="text-cyan-400">{exercise.descanso_segundos}s</span>
                </span>
              </div>
            )}
          </div>

          {/* Notas */}
          {exercise.notas && (
            <div className="bg-dashboard-accent/50 p-3 rounded-lg border border-dashboard-accent/30">
              <div className="flex items-start gap-2">
                <MessageSquare size={14} className="text-dashboard-text-secondary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-dashboard-text-secondary italic leading-relaxed">
                  "{exercise.notas}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Botón de completado */}
        <button
          onClick={handleToggle}
          className={`
            flex-shrink-0 p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-110
            ${isCompleted 
              ? 'border-green-500 bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:border-green-400' 
              : 'border-dashboard-accent/50 bg-dashboard-accent/20 text-dashboard-text-secondary hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-cyan-400'
            }
          `}
          title={isCompleted ? 'Marcar como no completado' : 'Marcar como completado'}
        >
          {isCompleted ? <CheckCircle size={28} /> : <Circle size={28} />}
        </button>
      </div>

      {/* Indicador de estado */}
      <div className={`mt-3 text-xs font-bold px-3 py-1 rounded-full border ${
        isCompleted 
          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
          : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
      }`}>
        {isCompleted ? '✅ COMPLETADO' : '🔄 PENDIENTE'}
      </div>
    </div>
  );
};

export default TrainingExerciseCard;