// roshi_fit/src/pages/dashboard/client/exercises/ClientExerciseList.tsx
import React, { useState, useEffect } from 'react';
import { fetchExercises } from '../../../../api/exerciseApi';
import type { Exercise, ExerciseFilters } from '../../../../types/Exercise';
import ClientExerciseFilters from './ClientExerciseFilters';
import { Dumbbell, Activity, Target, FileText, Loader, TrendingUp } from 'lucide-react';

// Hook para detectar el tema del dashboard
const useDashboardThemeDetection = () => {
  const [detectedTheme, setDetectedTheme] = useState<'nocturno' | 'amanecer'>('nocturno');

  useEffect(() => {
    const checkTheme = () => {
      const bodyClass = document.body.className;
      if (bodyClass.includes('theme-dashboard-amanecer')) {
        setDetectedTheme('amanecer');
      } else {
        setDetectedTheme('nocturno');
      }
    };

    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return detectedTheme;
};

const ClientExerciseList: React.FC = () => {
  const theme = useDashboardThemeDetection();
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

  // Estilos según tema
  const getStyles = () => {
    if (theme === 'amanecer') {
      return {
        container: 'bg-white border-slate-300',
        containerShadow: '0 20px 40px rgba(74, 144, 226, 0.15)',
        headerIcon: 'bg-red-100 text-red-600',
        headerTitle: 'text-gray-900',
        tableContainer: 'bg-white border-slate-300',
        tableHeader: 'bg-gradient-to-r from-slate-100 to-slate-200',
        tableHeaderText: 'text-gray-800',
        tableHeaderIcon: 'text-red-500',
        tableRow: 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-slate-200',
        tableCellName: 'text-gray-900 group-hover:text-blue-600',
        tableCellDesc: 'text-gray-600 group-hover:text-gray-800',
        tableBorder: 'border-slate-200',
        difficulty: {
          principiante: 'bg-green-100 text-green-700 border-green-400',
          intermedio: 'bg-yellow-100 text-yellow-700 border-yellow-400',
          avanzado: 'bg-red-100 text-red-700 border-red-400'
        },
        muscle: 'bg-purple-100 text-purple-700 border-purple-400',
        emptyContainer: 'bg-gradient-to-br from-slate-50 to-white border-slate-300',
        emptyIcon: 'text-gray-400',
        emptyTitle: 'text-gray-900',
        emptyText: 'text-gray-600',
        loadingSpinner: 'border-blue-500'
      };
    }
    
    // Tema Nocturno
    return {
      container: 'bg-[#16213E]/50 border-purple-500/30',
      containerShadow: '0 20px 40px rgba(138, 43, 226, 0.3)',
      headerIcon: 'bg-red-500/20 text-red-400',
      headerTitle: 'text-white',
      tableContainer: 'bg-[#0A0E27]/50 border-purple-500/30',
      tableHeader: 'bg-gradient-to-r from-purple-900/30 to-[#16213E]',
      tableHeaderText: 'text-white',
      tableHeaderIcon: 'text-red-400',
      tableRow: 'bg-[#16213E]/30 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10 border-purple-500/20',
      tableCellName: 'text-white group-hover:text-cyan-400',
      tableCellDesc: 'text-[#B0BEC5] group-hover:text-white',
      tableBorder: 'border-purple-500/20',
      difficulty: {
        principiante: 'bg-green-500/20 text-green-400 border-green-500/40',
        intermedio: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
        avanzado: 'bg-red-500/20 text-red-400 border-red-500/40'
      },
      muscle: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      emptyContainer: 'bg-[#16213E]/50 border-purple-500/30',
      emptyIcon: 'text-purple-500/50',
      emptyTitle: 'text-white',
      emptyText: 'text-[#B0BEC5]',
      loadingSpinner: 'border-cyan-500'
    };
  };

  const styles = getStyles();

  const formatDifficulty = (dificultad: string) => {
    const map: Record<string, { text: string; icon: React.ReactNode }> = {
      principiante: { text: 'Principiante', icon: <TrendingUp size={14} className="rotate-90" /> },
      intermedio: { text: 'Intermedio', icon: <TrendingUp size={14} /> },
      avanzado: { text: 'Avanzado', icon: <TrendingUp size={14} className="-rotate-45" /> },
    };
    const difficulty = map[dificultad] || { text: dificultad, icon: null };
    const colorClass = styles.difficulty[dificultad as keyof typeof styles.difficulty] || styles.difficulty.principiante;
    
    return (
      <span className={`${colorClass} px-3 py-1.5 rounded-xl text-xs font-black border-2 inline-flex items-center gap-1.5 shadow-sm`}>
        {difficulty.icon}
        {difficulty.text}
      </span>
    );
  };

  const formatMuscleType = (tipo_musculo: string) => {
    return (
      <span className={`${styles.muscle} px-3 py-1.5 rounded-xl text-xs font-black border-2 capitalize inline-flex items-center gap-1.5 shadow-sm`}>
        <Target size={14} />
        {tipo_musculo}
      </span>
    );
  };

  return (
    <div 
      className={`${styles.container} p-6 md:p-8 rounded-3xl border-2 transition-all duration-300`}
      style={{ boxShadow: styles.containerShadow }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-4 ${styles.headerIcon} rounded-2xl shadow-lg transform hover:scale-110 transition-all duration-300`}>
          <Dumbbell size={32} />
        </div>
        <div>
          <h1 className={`text-3xl md:text-4xl font-black ${styles.headerTitle}`}>
            BIBLIOTECA DE EJERCICIOS
          </h1>
          <p className={`text-sm md:text-base font-semibold mt-1`} style={{ color: theme === 'amanecer' ? '#6b7280' : '#B0BEC5' }}>
            Explora nuestra colección completa
          </p>
        </div>
      </div>

      {/* Filtros */}
      <ClientExerciseFilters onFilterChange={setFilters} />

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 mt-6">
          <Loader className={`animate-spin h-16 w-16 ${styles.loadingSpinner} mb-4`} />
          <p className={`${styles.headerTitle} font-bold text-lg`}>Cargando ejercicios...</p>
          <p style={{ color: theme === 'amanecer' ? '#6b7280' : '#B0BEC5' }} className="text-sm mt-2">
            Preparando tu biblioteca personalizada
          </p>
        </div>
      ) : (
        <div className="mt-6">
          {exercises.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl">
              <div 
                className={`${styles.tableContainer} border-2 overflow-hidden shadow-xl`}
              >
                <table className="min-w-full">
                  <thead className={styles.tableHeader}>
                    <tr>
                      <th scope="col" className={`px-6 py-5 text-left text-sm font-black ${styles.tableHeaderText} uppercase tracking-wider border-r ${styles.tableBorder}`}>
                        <div className="flex items-center gap-2">
                          <Activity size={18} className={styles.tableHeaderIcon} />
                          EJERCICIO
                        </div>
                      </th>
                      <th scope="col" className={`px-6 py-5 text-left text-sm font-black ${styles.tableHeaderText} uppercase tracking-wider border-r ${styles.tableBorder}`}>
                        <div className="flex items-center gap-2">
                          <FileText size={18} className={styles.tableHeaderIcon} />
                          DESCRIPCIÓN
                        </div>
                      </th>
                      <th scope="col" className={`px-6 py-5 text-left text-sm font-black ${styles.tableHeaderText} uppercase tracking-wider border-r ${styles.tableBorder}`}>
                        <div className="flex items-center gap-2">
                          <Target size={18} className={styles.tableHeaderIcon} />
                          MÚSCULO
                        </div>
                      </th>
                      <th scope="col" className={`px-6 py-5 text-left text-sm font-black ${styles.tableHeaderText} uppercase tracking-wider`}>
                        <div className="flex items-center gap-2">
                          <TrendingUp size={18} className={styles.tableHeaderIcon} />
                          DIFICULTAD
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercises.map((exercise, index) => (
                      <tr 
                        key={exercise.id} 
                        className={`
                          ${styles.tableRow} border-b ${styles.tableBorder} 
                          transition-all duration-300 group
                        `}
                      >
                        <td className={`px-6 py-5 text-base font-bold ${styles.tableCellName} border-r ${styles.tableBorder} transition-colors duration-300`}>
                          <div className="flex items-center gap-2">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${theme === 'amanecer' ? 'bg-blue-100 text-blue-600' : 'bg-cyan-500/20 text-cyan-400'}`}>
                              {index + 1}
                            </span>
                            {exercise.nombre}
                          </div>
                        </td>
                        <td className={`px-6 py-5 text-sm ${styles.tableCellDesc} border-r ${styles.tableBorder} max-w-md transition-colors duration-300`}>
                          <p className="line-clamp-2 leading-relaxed">
                            {exercise.descripcion || (
                              <span className="italic opacity-50">Sin descripción disponible</span>
                            )}
                          </p>
                        </td>
                        <td className={`px-6 py-5 border-r ${styles.tableBorder}`}>
                          {formatMuscleType(exercise.tipo_musculo)}
                        </td>
                        <td className="px-6 py-5">
                          <div className="transform group-hover:scale-110 transition-transform duration-300">
                            {formatDifficulty(exercise.dificultad)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div 
              className={`${styles.emptyContainer} text-center py-20 rounded-3xl border-2 mt-6`}
              style={{ boxShadow: styles.containerShadow }}
            >
              <div className={`text-8xl mb-6 ${styles.emptyIcon}`}>🏋️</div>
              <h3 className={`${styles.emptyTitle} text-3xl font-black mb-4`}>
                NO SE ENCONTRARON EJERCICIOS
              </h3>
              <p className={`${styles.emptyText} text-lg max-w-md mx-auto`}>
                Intenta ajustar los filtros de búsqueda para encontrar ejercicios disponibles.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientExerciseList;