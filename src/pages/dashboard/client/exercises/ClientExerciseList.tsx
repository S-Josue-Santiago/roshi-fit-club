// roshi_fit/src/pages/dashboard/client/exercises/ClientExerciseList.tsx
import React, { useState, useEffect } from 'react';
import { fetchExercises } from '../../../../api/exerciseApi';
import type { Exercise, ExerciseFilters } from '../../../../types/Exercise';
import ClientExerciseFilters from './ClientExerciseFilters';
import { Dumbbell, Activity, Target, Edit } from 'lucide-react';

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
    const map: Record<string, { text: string; color: string; bg: string }> = {
      principiante: { text: 'Principiante', color: 'text-green-400', bg: 'bg-green-600/20' },
      intermedio: { text: 'Intermedio', color: 'text-yellow-400', bg: 'bg-yellow-600/20' },
      avanzado: { text: 'Avanzado', color: 'text-red-400', bg: 'bg-red-600/20' },
    };
    const difficulty = map[dificultad] || { text: dificultad, color: 'text-gray-400', bg: 'bg-gray-600/20' };
    return (
      <span className={`${difficulty.color} ${difficulty.bg} px-3 py-1 rounded-full text-xs font-bold border border-current/30`}>
        {difficulty.text}
      </span>
    );
  };

  const formatMuscleType = (tipo_musculo: string) => {
    return (
      <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-600/30 capitalize">
        {tipo_musculo}
      </span>
    );
  };

  return (
    <div className="
      bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent
      shadow-lg hover:shadow-xl transition-all duration-300
    ">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-600/20 rounded-lg">
          <Dumbbell size={24} className="text-red-400" />
        </div>
        <h1 className="text-2xl font-black text-dashboard-text">BIBLIOTECA DE EJERCICIOS</h1>
      </div>

      <ClientExerciseFilters onFilterChange={setFilters} />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dashboard-primary"></div>
        </div>
      ) : (
        <div className="overflow-x-auto mt-6">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-dashboard-accent/50 rounded-lg bg-dashboard-accent/10">
              <table className="min-w-full divide-y divide-dashboard-accent/30">
                <thead className="bg-dashboard-accent/50">
                  <tr>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2"><Activity size={16} className="text-red-400" />NOMBRE</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2"><Edit size={16} className="text-red-400" />DESCRIPCIÓN</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2"><Target size={16} className="text-red-400" />MÚSCULO</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider">
                      <div className="flex items-center gap-2"><Dumbbell size={16} className="text-red-400" />DIFICULTAD</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashboard-accent/20">
                  {exercises.map(exercise => (
                    <tr key={exercise.id} className="transition-all duration-300 hover:bg-black hover:bg-opacity-80 group bg-dashboard-accent/5">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-dashboard-text group-hover:text-white border-r border-dashboard-accent/30">
                        {exercise.nombre}
                      </td>
                      <td className="px-4 py-4 text-sm text-dashboard-text-secondary group-hover:text-white border-r border-dashboard-accent/30 max-w-sm">
                        <p className="line-clamp-2">
                          {exercise.descripcion || <span className="italic text-dashboard-text-secondary/50">Sin descripción</span>}
                        </p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm border-r border-dashboard-accent/30">
                        {formatMuscleType(exercise.tipo_musculo)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="group-hover:scale-105 transition-transform duration-300">
                          {formatDifficulty(exercise.dificultad)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {exercises.length === 0 && !loading && (
            <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
              <div className="text-6xl mb-4">🏋️</div>
              <p className="text-dashboard-text text-xl font-black">No se encontraron ejercicios</p>
              <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
                Intenta ajustar los filtros de búsqueda.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientExerciseList;
