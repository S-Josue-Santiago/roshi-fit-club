// roshi_fit/src/pages/dashboard/client/exercises/ClientExerciseFilters.tsx
import React, { useState, useEffect } from 'react';
import { fetchMuscleTypes } from '../../../../api/exerciseApi';
import { Search, Filter, Target, Activity } from 'lucide-react';

interface ExerciseFiltersProps {
  onFilterChange: (filters: { search: string; dificultad: string; tipo_musculo: string }) => void;
}

const ClientExerciseFilters: React.FC<ExerciseFiltersProps> = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [dificultad, setDificultad] = useState('');
  const [tipo_musculo, setTipoMusculo] = useState('');
  const [muscleTypes, setMuscleTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchMuscleTypes().then(types => {
      setMuscleTypes(types);
    }).catch(console.error);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ search: value, dificultad, tipo_musculo });
  };

  const handleDificultadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDificultad(value);
    onFilterChange({ search, dificultad: value, tipo_musculo });
  };

  const handleTipoMusculoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTipoMusculo(value);
    onFilterChange({ search, dificultad, tipo_musculo: value });
  };

  const clearFilters = () => {
    setSearch('');
    setDificultad('');
    setTipoMusculo('');
    onFilterChange({ search: '', dificultad: '', tipo_musculo: '' });
  };

  const hasActiveFilters = search || dificultad || tipo_musculo;

  return (
    <div className="bg-dashboard-accent/20 p-6 rounded-xl border-2 border-dashboard-accent/30 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Búsqueda */}
        <div className="lg:col-span-2">
          <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
            <Search size={16} className="text-cyan-400" />
            BUSCAR EJERCICIOS
          </label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              className="
                w-full p-4 pl-12 bg-dashboard-bg text-dashboard-text 
                rounded-xl border-2 border-dashboard-accent/50
                focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                hover:border-cyan-400/50 transition-all duration-300
                placeholder:text-dashboard-text-secondary/50
              "
              placeholder="Nombre del ejercicio..."
            />
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary" />
          </div>
        </div>

        {/* Filtro de Dificultad */}
        <div>
          <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
            <Activity size={16} className="text-cyan-400" />
            DIFICULTAD
          </label>
          <select
            value={dificultad}
            onChange={handleDificultadChange}
            className="
              w-full p-4 bg-dashboard-bg text-dashboard-text 
              rounded-xl border-2 border-dashboard-accent/50
              focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
              hover:border-cyan-400/50 transition-all duration-300
              cursor-pointer
            "
          >
            <option className='text-black' value="">Todas las dificultades</option>
            <option className='text-black' value="principiante">Principiante</option>
            <option className='text-black' value="intermedio">Intermedio</option>
            <option className='text-black' value="avanzado">Avanzado</option>
          </select>
        </div>

        {/* Filtro de Tipo de Músculo */}
        <div>
          <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
            <Target size={16} className="text-cyan-400" />
            GRUPO MUSCULAR
          </label>
          <select
            value={tipo_musculo}
            onChange={handleTipoMusculoChange}
            className="
              w-full p-4 bg-dashboard-bg text-dashboard-text 
              rounded-xl border-2 border-dashboard-accent/50
              focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
              hover:border-cyan-400/50 transition-all duration-300
              cursor-pointer
            "
          >
            <option className='text-black' value="">Todos los músculos</option>
            {muscleTypes.map(type => (
              <option className='text-black' key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Controles adicionales */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pt-4 border-t border-dashboard-accent/30">
        {/* Contador de filtros activos */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-dashboard-text-secondary" />
          <span className="text-sm text-dashboard-text-secondary">
            {hasActiveFilters ? 'Filtros activos' : 'Sin filtros aplicados'}
          </span>
          {hasActiveFilters && (
            <span className="bg-cyan-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              {[search, dificultad, tipo_musculo].filter(Boolean).length}
            </span>
          )}
        </div>

        {/* Botón limpiar filtros */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="
              px-4 py-2 text-cyan-400 font-bold text-sm
              border border-cyan-400/30 rounded-lg
              hover:bg-cyan-400/10 hover:border-cyan-400/50
              transition-all duration-300 transform hover:scale-105
              flex items-center gap-2
            "
          >
            <Filter size={14} />
            LIMPIAR FILTROS
          </button>
        )}
      </div>
    </div>
  );
};

export default ClientExerciseFilters;