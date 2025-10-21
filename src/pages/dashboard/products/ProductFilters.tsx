// roshi_fit/src/pages/dashboard/products/ProductFilters.tsx
import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../../../api/categoryApi';
import { type Category } from '../../../types/Category';

interface ProductFiltersProps {
  onFilterChange: (filters: {
    search: string;
    categoria_id: string;
    estado: string;
  }) => void;
  onAddProduct: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange, onAddProduct }) => {
  const [search, setSearch] = useState('');
  const [categoria_id, setCategoriaId] = useState('');
  const [estado, setEstado] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  // Cargar categorías al montar
  useEffect(() => {
    // Proporcionar un objeto filters vacío o con valores por defecto
    const filters = {
      // Aquí incluye los filtros que requiere la función
      // Por ejemplo:
      search: '',
      estado: 'activo'
      // Ajusta según lo que necesite tu API
    };
    
    fetchCategories(filters).then(setCategories).catch(console.error);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ search: value, categoria_id, estado });
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategoriaId(value);
    onFilterChange({ search, categoria_id: value, estado });
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEstado(value);
    onFilterChange({ search, categoria_id, estado: value });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      {/* Búsqueda */}
      <div className="w-full md:w-1/3">
        <input
          type="text"
          placeholder="🔍 Buscar producto..."
          value={search}
          onChange={handleSearchChange}
          className="w-full p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent focus:ring-dashboard-primary focus:border-dashboard-primary"
        />
      </div>

      {/* Filtros y Botón */}
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        <select
          value={categoria_id}
          onChange={handleCategoriaChange}
          className="p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent"
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

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
          onClick={onAddProduct}
          className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded-lg hover:bg-dashboard-secondary transition-colors"
        >
          + Nuevo Producto
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;