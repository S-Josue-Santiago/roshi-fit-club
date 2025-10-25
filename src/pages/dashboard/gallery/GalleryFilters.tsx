// roshi_fit/src/pages/dashboard/gallery/GalleryFilters.tsx
import React, { useState } from 'react';
import { Search, Filter, Plus, Tag } from 'lucide-react';

interface GalleryFiltersProps {
  onFilterChange: (filters: { search: string; categoria: string; estado: string }) => void;
  onAddItem: () => void;
}

const GalleryFilters: React.FC<GalleryFiltersProps> = ({ onFilterChange, onAddItem }) => {
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ search: value, categoria, estado });
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategoria(value);
    onFilterChange({ search, categoria: value, estado });
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    setEstado(value);
    onFilterChange({ search, categoria, estado: value });
  };

  return (
    <div className="
      flex flex-col lg:flex-row justify-between items-start lg:items-center 
      gap-4 mb-6 p-4 bg-dashboard-accent/20 rounded-xl border border-dashboard-accent/50
    ">
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-3/4">
        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-bold text-dashboard-text mb-2">
            <Search size={16} className="inline mr-2" />
            BUSCAR POR TÍTULO
          </label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              className="w-full p-3 pl-10 bg-dashboard-accent text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 hover:border-pink-400/50 transition-all duration-300 placeholder:text-dashboard-text-secondary text-sm"
              placeholder="Título del item..."
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary" />
          </div>
        </div>

        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-bold text-dashboard-text mb-2">
            <Tag size={16} className="inline mr-2" />
            BUSCAR POR CATEGORÍA
          </label>
          <div className="relative">
            <input
              type="text"
              value={categoria}
              onChange={handleCategoriaChange}
              className="w-full p-3 pl-10 bg-dashboard-accent text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 hover:border-pink-400/50 transition-all duration-300 placeholder:text-dashboard-text-secondary text-sm"
              placeholder="Nombre de categoría..."
            />
            <Tag size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary" />
          </div>
        </div>

        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-bold text-dashboard-text mb-2">
            <Filter size={16} className="inline mr-2" />
            FILTRAR POR ESTADO
          </label>
          <select
            value={estado}
            onChange={handleEstadoChange}
            className="w-full p-3 bg-dashboard-accent text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 hover:border-pink-400/50 transition-all duration-300 cursor-pointer text-sm"
          >
            <option className="bg-black" value="">Todos los estados</option>
            <option className="bg-black" value="activo">Activo</option>
            <option className="bg-black" value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="w-full lg:w-1/4 flex justify-end">
        <button
          onClick={onAddItem}
          className="
            w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 
            text-white font-bold rounded-xl hover:from-pink-700 hover:to-pink-800
            transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
            border-2 border-pink-500/30 flex items-center justify-center gap-2 group text-sm
          "
        >
          <Plus size={20} className="group-hover:scale-110 transition-transform" />
          <span>NUEVO ITEM</span>
        </button>
      </div>
    </div>
  );
};

export default GalleryFilters;