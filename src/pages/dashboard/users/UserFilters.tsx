// roshi_fit/src/pages/dashboard/users/UserFilters.tsx
import React from 'react';
import { Search, UserPlus, Filter } from 'lucide-react';

interface UserFiltersProps {
  filters: {
    search: string;
    tipo_usuario: string;
    estado: string;
  };
  onFilterChange: (filters: { search: string; tipo_usuario: string; estado: string }) => void;
  onAddUser: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ filters, onFilterChange, onAddUser }) => {
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
            BUSCAR USUARIO
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="
                w-full p-3 pl-10 bg-dashboard-accent text-dashboard-text 
                rounded-xl border-2 border-dashboard-accent/50
                focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                hover:border-cyan-400/50 transition-all duration-300
                placeholder:text-dashboard-text-secondary
              "
              placeholder="Nombre, email..."
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary" />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-1/2 lg:w-2/3">
          {/* Filtro de Rol */}
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-bold text-dashboard-text mb-2">
              <Filter size={16} className="inline mr-2" />
              FILTRAR POR ROL
            </label>
            <select 
              value={filters.tipo_usuario}
              onChange={(e) => onFilterChange({ ...filters, tipo_usuario: e.target.value })}
              className="
                w-full p-3 bg-dashboard-accent text-dashboard-text 
                rounded-xl border-2 border-dashboard-accent/50
                focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                hover:border-cyan-400/50 transition-all duration-300
                cursor-pointer
              "
            >
              <option value="">Todos los roles</option>
              <option className='text-black' value="admin">Administrador</option>
              <option className='text-black' value="entrenador">Entrenador</option>
              <option className='text-black' value="cliente">Cliente</option>
            </select>
          </div>

          {/* Filtro de Estado */}
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-bold text-dashboard-text mb-2">
              <Filter size={16} className="inline mr-2" />
              FILTRAR POR ESTADO
            </label>
            <select
              value={filters.estado}
              onChange={(e) => onFilterChange({ ...filters, estado: e.target.value })}
              className="
                w-full p-3 bg-dashboard-accent text-dashboard-text 
                rounded-xl border-2 border-dashboard-accent/50
                focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                hover:border-cyan-400/50 transition-all duration-300
                cursor-pointer
              "
            >
              <option value="">Todos los estados</option>
              <option className='text-black' value="activo">Activo</option>
              <option className='text-black' value="inactivo">Inactivo</option>
              <option className='text-black' value="desabilitado">Deshabilitado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botón Nuevo Usuario */}
      <div className="w-full lg:w-1/4 flex justify-end">
        <button
          onClick={onAddUser}
          className="
            w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 
            text-white font-bold rounded-xl hover:from-cyan-700 hover:to-cyan-800
            transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
            border-2 border-cyan-500/30 flex items-center justify-center gap-2
            group
          "
        >
          <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
          <span>NUEVO USUARIO</span>
        </button>
      </div>
    </div>
  );
};

export default UserFilters;