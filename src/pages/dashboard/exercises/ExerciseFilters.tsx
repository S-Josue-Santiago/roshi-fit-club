// roshi_fit/src/pages/dashboard/exercises/ExerciseFilters.tsx
import React, { useState, useEffect } from 'react';
import {  fetchMuscleTypes } from '../../../api/exerciseApi';

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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="w-full md:w-1/3">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre..."
          value={search}
          onChange={handleSearchChange}
          className="w-full p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent focus:ring-dashboard-primary focus:border-dashboard-primary"
        />
      </div>
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        <select
          value={dificultad}
          onChange={handleDificultadChange}
          className="p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent"
        >
          <option value="">Todas las dificultades</option>
          <option value="principiante">Principiante</option>
          <option value="intermedio">Intermedio</option>
          <option value="avanzado">Avanzado</option>
        </select>

        <select
        value={tipo_musculo}
        onChange={handleTipoMusculoChange}
        >
        <option value="">Todos los músculos</option>
        {muscleTypes.map(type => (
            <option key={type} value={type}>
            {type}
            </option>
        ))}
        </select>

        <button
          onClick={onAddExercise}
          className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded-lg hover:bg-dashboard-secondary transition-colors"
        >
          + Nuevo Ejercicio
        </button>
      </div>
    </div>
  );
};

export default ExerciseFilters;