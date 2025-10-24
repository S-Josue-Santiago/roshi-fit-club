// roshi_fit/src/pages/dashboard/categories/CategoryFilters.tsx
import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';

interface CategoryFiltersProps {
  onFilterChange: (filters: { search: string; estado: string }) => void;
  onAddCategory: () => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ onFilterChange, onAddCategory }) => {
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ search: value, estado });
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEstado(value);
    onFilterChange({ search, estado: value });
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 p-4 bg-dashboard-accent/20 rounded-xl border border-dashboard-accent/50">
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
        <div>
          <label className=" text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
            <Search size={16} className="text-green-400" />
            BUSCAR CATEGORÍA
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Nombre de categoría..."
              value={search}
              onChange={handleSearchChange}
              className="w-full sm:w-64 p-3 pl-10 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 hover:border-green-400/50 transition-all duration-300"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary" />
          </div>
        </div>
        <div>
          <label className=" text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
            <Filter size={16} className="text-green-400" />
            ESTADO
          </label>
          <select
            value={estado}
            onChange={handleEstadoChange}
            className=" w-full sm:w-auto p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 hover:border-green-400/50 transition-all duration-300 cursor-pointer"
          >
            <option className="bg-black" value="">Todos</option>
            <option className="bg-black" value="activo">Activo</option>
            <option className="bg-black" value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="w-full lg:w-auto">
        <button
          onClick={onAddCategory}
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
          <span>NUEVA CATEGORÍA</span>
        </button>
      </div>
    </div>
  );
};

export default CategoryFilters;