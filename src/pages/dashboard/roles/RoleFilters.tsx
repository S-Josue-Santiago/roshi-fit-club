// roshi_fit/src/pages/dashboard/roles/RoleFilters.tsx
import React, { useState } from 'react';
import { Search, ShieldPlus, Filter } from 'lucide-react';

interface RoleFiltersProps {
  onFilterChange: (filters: { search: string; estado: string }) => void;
  onAddRole: () => void;
}

const RoleFilters: React.FC<RoleFiltersProps> = ({ onFilterChange, onAddRole }) => {
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
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-2/3">
        {/* Búsqueda con etiqueta */}
        <div className="w-full sm:w-1/2 lg:w-1/3">
          <label className="block text-sm font-bold text-dashboard-text mb-2">
            <Search size={16} className="inline mr-2" />
            BUSCAR ROL
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
                placeholder:text-dashboard-text-secondary
              "
              placeholder="Nombre del rol..."
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
              cursor-pointer
            "
          >
            <option value="">Todos los estados</option>
            <option className='text-black' value="activo">Activo</option>
            <option className='text-black' value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Botón Nuevo Rol */}
      <div className="w-full lg:w-1/4 flex justify-end">
        <button
          onClick={onAddRole}
          className="
            w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 
            text-white font-bold rounded-xl hover:from-purple-700 hover:to-purple-800
            transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
            border-2 border-purple-500/30 flex items-center justify-center gap-2
            group
          "
        >
          <ShieldPlus size={20} className="group-hover:scale-110 transition-transform" />
          <span>NUEVO ROL</span>
        </button>
      </div>
    </div>
  );
};

export default RoleFilters;