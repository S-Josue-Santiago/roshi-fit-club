// roshi_fit/src/pages/dashboard/gallery/GalleryFilters.tsx
import React, { useState } from 'react';

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

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEstado(value);
    onFilterChange({ search, categoria, estado: value });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="w-full md:w-1/3">
        <input
          type="text"
          placeholder="🔍 Buscar por título..."
          value={search}
          onChange={handleSearchChange}
          className="w-full p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent focus:ring-dashboard-primary focus:border-dashboard-primary"
        />
      </div>
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        <input
          type="text"
          placeholder="Filtrar por categoría"
          value={categoria}
          onChange={handleCategoriaChange}
          className="p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent"
        />
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
          onClick={onAddItem}
          className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded-lg hover:bg-dashboard-secondary transition-colors"
        >
          + Nuevo Item
        </button>
      </div>
    </div>
  );
};

export default GalleryFilters;