// roshi_fit/src/pages/dashboard/exercises/ExerciseFilters.tsx
import React, { useState, useEffect } from 'react';
import {  fetchMuscleTypes } from '../../../api/exerciseApi';
import { Search, Plus, Dumbbell , Activity } from 'lucide-react';

interface ExerciseFiltersProps {
  onFilterChange: (filters: { search: string; dificultad: string; tipo_musculo: string }) => void;
  onAddExercise: () => void;
}

const ExerciseFilters: React.FC<ExerciseFiltersProps> = ({ onFilterChange, onAddExercise }) => {
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

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 p-4 bg-dashboard-accent/20 rounded-xl border border-dashboard-accent/50">
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
        <div>
          <label className=" text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
            <Search size={16} className="text-blue-400" />
            BUSCAR EJERCICIO
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Nombre del ejercicio..."
              value={search}
              onChange={handleSearchChange}
              className="w-full sm:w-64 p-3 pl-10 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-400/50 transition-all duration-300"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div>
            <label className=" text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
              <Activity size={16} className="text-blue-400" />
              DIFICULTAD
            </label>
            <select
              value={dificultad}
              onChange={handleDificultadChange}
              className=" w-full sm:w-auto p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-400/50 transition-all duration-300 cursor-pointer"
            >
              <option className="bg-black" value="">Todas</option>
              <option className="bg-black" value="principiante">Principiante</option>
              <option className="bg-black" value="intermedio">Intermedio</option>
              <option className="bg-black" value="avanzado">Avanzado</option>
            </select>
          </div>
          <div>
            <label className=" text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
              <Dumbbell  size={16} className="text-blue-400" />
              MÚSCULO
            </label>
            <select
              value={tipo_musculo}
              onChange={handleTipoMusculoChange}
              className=" w-full sm:w-auto p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-blue-400/50 transition-all duration-300 cursor-pointer"
            >
              <option className="bg-black" value="">Todos</option>
              {muscleTypes.map(type => (
                <option className="bg-black" key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-auto">
        <button
          onClick={onAddExercise}
          className="
            w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 
            text-white font-bold rounded-xl 
            hover:from-green-700 hover:to-green-800
            transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
            border-2 border-green-500/30 flex items-center justify-center gap-2
            group
          "
        >
          <Plus size={20} className="group-hover:scale-110 transition-transform" />
          <span>NUEVO EJERCICIO</span>
        </button>
      </div>
    </div>
  );
};

export default ExerciseFilters;