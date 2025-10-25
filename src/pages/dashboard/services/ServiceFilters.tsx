// roshi_fit/src/pages/dashboard/services/ServiceFilters.tsx
import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';

interface ServiceFiltersProps {
  onFilterChange: (filters: { search: string; estado: string }) => void;
  onAddService: () => void;
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({ onFilterChange, onAddService }) => {
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
    <div className="
      flex flex-col lg:flex-row justify-between items-start lg:items-center 
      gap-4 mb-6 p-4 bg-dashboard-accent/20 rounded-xl border border-dashboard-accent/50
    ">
      {/* Contenedor de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-3/4">
        {/* Búsqueda */}
        <div className="w-full sm:w-1/2 lg:w-1/3">
          <label className="block text-sm font-bold text-dashboard-text mb-2">
            <Search size={16} className="inline mr-2" />
            BUSCAR SERVICIO
          </label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              className="
                w-full p-3 pl-10 bg-dashboard-accent text-dashboard-text 
                rounded-xl border-2 border-dashboard-accent/50
                focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
                hover:border-purple-400/50 transition-all duration-300
                placeholder:text-dashboard-text-secondary text-sm
              "
              placeholder="Nombre del servicio..."
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary" />
          </div>
        </div>

        {/* Filtro de Estado */}
        <div className="w-full sm:w-1/2 lg:w-1/3">
          <label className="block text-sm font-bold text-dashboard-text mb-2">
            <Filter size={16} className="inline mr-2" />
            FILTRAR POR ESTADO
          </label>
          <select
            value={estado}
            onChange={handleEstadoChange}
            className="
              w-full p-3 bg-dashboard-accent text-dashboard-text 
              rounded-xl border-2 border-dashboard-accent/50
              focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
              hover:border-purple-400/50 transition-all duration-300
              cursor-pointer text-sm
            "
          >
            <option className="bg-black" value="">Todos los estados</option>
            <option className="bg-black" value="activo">Activo</option>
            <option className="bg-black" value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>
      {/* Botón Nuevo Servicio */}
      <div className="w-full lg:w-1/4 flex justify-end">
        <button
          onClick={onAddService}
          className="
            w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 
            text-white font-bold rounded-xl hover:from-purple-700 hover:to-purple-800
            transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
            border-2 border-purple-500/30 flex items-center justify-center gap-2 group text-sm
          "
        >
          <Plus size={20} className="group-hover:scale-110 transition-transform" />
          <span>NUEVO SERVICIO</span>
        </button>
      </div>
    </div>
  );
};

export default ServiceFilters;