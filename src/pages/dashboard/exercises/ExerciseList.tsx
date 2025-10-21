// roshi_fit/src/pages/dashboard/exercises/ExerciseList.tsx
import React, { useState, useEffect } from 'react';
import { fetchExercises } from '../../../api/exerciseApi';
import type { Exercise, ExerciseFilters } from '../../../types/Exercise';
import ExerciseFiltersComponent from './ExerciseFilters';
import ExerciseActions from './ExerciseActions';
import CreateExerciseModal from './CreateExerciseModal';
import EditExerciseModal from './EditExerciseModal';

const ExerciseList: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ExerciseFilters>({
    search: '',
    dificultad: '',
    tipo_musculo: ''
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<number | null>(null);

  useEffect(() => {
    const loadExercises = async () => {
      setLoading(true);
      try {
        const data = await fetchExercises(filters);
        setExercises(data);
      } catch (error) {
        console.error('Error al cargar ejercicios:', error);
      } finally {
        setLoading(false);
      }
    };
    loadExercises();
  }, [filters]);

  const handleAddExercise = () => setIsCreateModalOpen(true);
  const handleCreateSuccess = () => setFilters({ search: '', dificultad: '', tipo_musculo: '' });
  const handleEdit = (id: number) => setEditingExerciseId(id);
  const handleUpdateSuccess = () => setFilters(prev => ({ ...prev }));

  const formatDifficulty = (dificultad: string) => {
    const map: Record<string, string> = {
      principiante: '🟢 Principiante',
      intermedio: '🟡 Intermedio',
      avanzado: '🔴 Avanzado',
    };
    return map[dificultad] || dificultad;
  };

  return (
    <div className="bg-dashboard-accent/30 p-6 rounded-xl border border-dashboard-accent">
      <ExerciseFiltersComponent onFilterChange={setFilters} onAddExercise={handleAddExercise} />

      {loading ? (
        <p className="text-dashboard-text py-6 text-center">Cargando ejercicios...</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-dashboard-text">
            <thead>
              <tr className="border-b border-dashboard-accent">
                <th className="py-3 px-4 text-left">NOMBRE</th>
                <th className="py-3 px-4 text-left">DESCRIPCIÓN</th>
                <th className="py-3 px-4 text-left">MÚSCULO</th>
                <th className="py-3 px-4 text-left">DIFICULTAD</th>
                <th className="py-3 px-4 text-left">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map(exercise => (
                <tr key={exercise.id} className="border-b border-dashboard-accent/50 hover:bg-dashboard-accent/20">
                  <td className="py-3 px-4 font-medium">{exercise.nombre}</td>
                  <td className="py-3 px-4 text-dashboard-text-secondary max-w-xs truncate">
                    {exercise.descripcion || '—'}
                  </td>
                  <td className="py-3 px-4">{exercise.tipo_musculo}</td>
                  <td className="py-3 px-4">{formatDifficulty(exercise.dificultad)}</td>
                  <td className="py-3 px-4">
                    <ExerciseActions exercise={exercise} onEdit={handleEdit} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {exercises.length === 0 && !loading && (
            <p className="text-dashboard-text text-center py-6">No se encontraron ejercicios.</p>
          )}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateExerciseModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateSuccess}
        />
      )}

      {editingExerciseId && (
        <EditExerciseModal
          exerciseId={editingExerciseId}
          onClose={() => setEditingExerciseId(null)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default ExerciseList;