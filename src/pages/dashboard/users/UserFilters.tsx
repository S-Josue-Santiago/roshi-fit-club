// roshi_fit/src/pages/dashboard/users/UserFilters.tsx
import React from 'react';

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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      {/* Búsqueda */}
      <div className="w-full md:w-1/3">
        <input
          type="text"
          placeholder="🔍 Buscar usuario..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="w-full p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent focus:ring-dashboard-primary focus:border-dashboard-primary"
        />
      </div>

      {/* Filtros y Botón */}
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        <select 
          value={filters.tipo_usuario}
          onChange={(e) => onFilterChange({ ...filters, tipo_usuario: e.target.value })}
          className="p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent "
        >
          <option className="text-black" value="">Todos los roles</option>
          <option className="text-black" value="admin">Admin</option>
          <option className="text-black" value="entrenador">Entrenador</option>
          <option className="text-black" value="cliente">Cliente</option>
        </select>

        <select
          value={filters.estado}
          onChange={(e) => onFilterChange({ ...filters, estado: e.target.value })}
          className="p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent"
        >
          <option className="text-black" value="">Todos los estados</option>
          <option className="text-black" value="activo">Activo</option>
          <option className="text-black" value="inactivo">Inactivo</option>
          <option className="text-black" value="desabilitado">Deshabilitado</option>
        </select>

        <button
          onClick={onAddUser}
          className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded-lg hover:bg-dashboard-secondary transition-colors"
        >
          + Nuevo Usuario
        </button>
      </div>
    </div>
  );
};

export default UserFilters;