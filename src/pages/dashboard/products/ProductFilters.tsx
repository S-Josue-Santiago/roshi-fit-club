// roshi_fit/src/pages/dashboard/products/ProductFilters.tsx
import React, { useState } from 'react';
import { fetchCategoriesProducts } from '../../../api/categoryApi';
import { type Category } from '../../../types/Category';
import { Search, PackagePlus, Tag, Activity } from 'lucide-react';

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
  React.useEffect(() => {
    fetchCategoriesProducts().then(setCategories).catch(console.error);
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
    <div className="
      flex flex-col lg:flex-row justify-between items-start lg:items-center 
      gap-4 mb-6 p-4 bg-dashboard-accent/20 rounded-xl border border-dashboard-accent/50
    ">
      {/* Contenedor de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-3/4">
        {/* Búsqueda con etiqueta */}
        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-bold text-dashboard-text mb-2">
            <Search size={16} className="inline mr-2" />
            BUSCAR PRODUCTO
          </label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              className="
                w-full p-3 pl-10 bg-dashboard-accent text-dashboard-text 
                rounded-xl border-2 border-dashboard-accent/50
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                hover:border-blue-400/50 transition-all duration-300
                placeholder:text-dashboard-text-secondary
                text-sm sm:text-base
              "
              placeholder="Nombre, SKU..."
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary" />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-2/3">
          {/* Filtro de Categoría */}
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-bold text-dashboard-text mb-2">
              <Tag size={16} className="inline mr-2" />
              FILTRAR POR CATEGORÍA
            </label>
            <select
              value={categoria_id}
              onChange={handleCategoriaChange}
              className="
                w-full p-3 bg-dashboard-accent text-dashboard-text 
                rounded-xl border-2 border-dashboard-accent/50
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                hover:border-blue-400/50 transition-all duration-300
                cursor-pointer text-sm sm:text-base
              "
            >
              <option className="text-black" value="">Todas las categorías</option>
              {categories.map(cat => (
                <option className="text-black" key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Estado */}
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-bold text-dashboard-text mb-2">
              <Activity size={16} className="inline mr-2" />
              FILTRAR POR ESTADO
            </label>
            <select
              value={estado}
              onChange={handleEstadoChange}
              className="
                w-full p-3 bg-dashboard-accent text-dashboard-text 
                rounded-xl border-2 border-dashboard-accent/50
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                hover:border-blue-400/50 transition-all duration-300
                cursor-pointer text-sm sm:text-base
              "
            >
              <option className="text-black" value="">Todos los estados</option>
              <option className="text-black" value="activo">Activo</option>
              <option className="text-black" value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botón Nuevo Producto */}
      <div className="w-full lg:w-1/4 flex justify-end">
        <button
          onClick={onAddProduct}
          className="
            w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 
            text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800
            transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
            border-2 border-blue-500/30 flex items-center justify-center gap-2
            group text-sm sm:text-base
          "
        >
          <PackagePlus size={20} className="group-hover:scale-110 transition-transform" />
          <span>NUEVO PRODUCTO</span>
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;