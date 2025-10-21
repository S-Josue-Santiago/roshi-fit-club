// roshi_fit/src/pages/dashboard/suppliers/SupplierFilters.tsx
import React, { useState } from 'react';

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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="w-full md:w-1/3">
        <input
          type="text"
          placeholder="🔍 Buscar proveedor..."
          value={search}
          onChange={handleSearchChange}
          className="w-full p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent focus:ring-dashboard-primary focus:border-dashboard-primary"
        />
      </div>
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        <select
          value={estado}
          onChange={handleEstadoChange}
          className="p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent"
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <button
          onClick={onAddSupplier}
          className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded-lg hover:bg-dashboard-secondary transition-colors"
        >
          + Nuevo Proveedor
        </button>
      </div>
    </div>
  );
};

export default SupplierFilters;