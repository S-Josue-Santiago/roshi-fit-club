// roshi_fit/src/pages/dashboard/suppliers/SupplierFilters.tsx
import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';

interface SupplierFiltersProps {
  onFilterChange: (filters: { search: string; estado: string }) => void;
  onAddSupplier: () => void;
}

const SupplierFilters: React.FC<SupplierFiltersProps> = ({ onFilterChange, onAddSupplier }) => {
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
        {/* Búsqueda con etiqueta */}
        <div className="w-full sm:w-1/2 lg:w-1/3">
          <label className="block text-sm font-bold text-dashboard-text mb-2">
            <Search size={16} className="inline mr-2" />
            BUSCAR PROVEEDOR
          </label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              className="
                w-full p-3 pl-10 bg-dashboard-accent text-dashboard-text 
                rounded-xl border-2 border-dashboard-accent/50
                focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20
                hover:border-orange-400/50 transition-all duration-300
                placeholder:text-dashboard-text-secondary
                text-sm
              "
              placeholder="Empresa, contacto, email..."
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
              focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20
              hover:border-orange-400/50 transition-all duration-300
              cursor-pointer text-sm
            "
          >
            <option className="bg-black" value="">Todos los estados</option>
            <option className="bg-black" value="activo">Activo</option>
            <option className="bg-black" value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Botón Nuevo Proveedor */}
      <div className="w-full lg:w-1/4 flex justify-end">
        <button
          onClick={onAddSupplier}
          className="
            w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 
            text-white font-bold rounded-xl hover:from-orange-700 hover:to-orange-800
            transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
            border-2 border-orange-500/30 flex items-center justify-center gap-2
            group text-sm
          "
        >
          <Plus size={20} className="group-hover:scale-110 transition-transform" />
          <span>NUEVO PROVEEDOR</span>
        </button>
      </div>
    </div>
  );
};

export default SupplierFilters;