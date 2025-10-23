// roshi_fit/src/pages/dashboard/client/exercises/ClientExerciseList.tsx
import React, { useState, useEffect } from 'react';
import { fetchExercises } from '../../../../api/exerciseApi';
import type { Exercise, ExerciseFilters } from '../../../../types/Exercise';
import ClientExerciseFilters from './ClientExerciseFilters';

const ClientExerciseList: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ExerciseFilters>({
    search: '',
    dificultad: '',
    tipo_musculo: ''
  });

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
      <ClientExerciseFilters onFilterChange={setFilters} />

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
                </tr>
              ))}
            </tbody>
          </table>

          {exercises.length === 0 && !loading && (
            <p className="text-dashboard-text text-center py-6">No se encontraron ejercicios.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientExerciseList;
