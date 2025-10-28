// roshi_fit/src/pages/dashboard/client/products/ProductList.tsx
import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../../../../api/productApi';
import type { Product } from '../../../../types/Product';
import ProductCard from './ProductCard';
import { Search, Filter, Package, Loader } from 'lucide-react';
import { fetchCategoriesProducts } from '../../../../api/categoryApi';
import type { Category } from '../../../../types/Category';

interface ProductListProps {
  usuarioId: number;
  onAddToCart: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ usuarioId, onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    categoria_id: '',
    estado: 'activo'
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const data = await fetchCategoriesProducts();
        setCategories(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        setCategoriesError('Error al cargar categorías.');
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts(filters);
        setProducts(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [filters]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-600/20 rounded-xl">
            <Package size={28} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-dashboard-text">PRODUCTOS DISPONIBLES</h1>
            <p className="text-dashboard-text-secondary text-sm">Explora nuestro catálogo de productos</p>
          </div>
        </div>
      </div>

      {/* Filtros Mejorados */}
      <div className="bg-dashboard-accent/20 p-6 rounded-xl border-2 border-dashboard-accent/30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
              <Search size={16} className="text-cyan-400" />
              BUSCAR PRODUCTO
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="
                  w-full p-4 pl-12 bg-dashboard-bg text-dashboard-text 
                  rounded-xl border-2 border-dashboard-accent/50
                  focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                  hover:border-cyan-400/50 transition-all duration-300
                  placeholder:text-dashboard-text-secondary/50
                "
                placeholder="Nombre, descripción..."
              />
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary" />
            </div>
          </div>

          {/* Filtro de Categoría */}
          <div>
            <label className=" text-sm font-bold text-dashboard-text mb-3 flex items-center gap-2">
              <Filter size={16} className="text-cyan-400" />
              FILTRAR POR CATEGORÍA
            </label>
            <select
              value={filters.categoria_id}
              onChange={(e) => setFilters({ ...filters, categoria_id: e.target.value })}
              className="
                w-full p-4 bg-dashboard-bg text-dashboard-text 
                rounded-xl border-2 border-dashboard-accent/50
                focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
                hover:border-cyan-400/50 transition-all duration-300
                cursor-pointer
              "
              disabled={categoriesLoading || !!categoriesError}
            >
              <option value="">Todas las categorías</option>
              {categoriesLoading ? (
                <option value="" disabled>Cargando categorías...</option>
              ) : categoriesError ? (
                <option value="" disabled>{categoriesError}</option>
              ) : (
                categories.map(category => (
                  <option className="text-black" key={category.id} value={category.id}>{category.nombre}</option>
                ))
              )}
            </select>
          </div>

          {/* Contador de productos */}
          <div className="flex items-end">
            <div className="bg-cyan-600/20 p-4 rounded-xl border-2 border-cyan-500/30 w-full text-center">
              <p className="text-cyan-400 text-sm font-bold">PRODUCTOS ENCONTRADOS</p>
              <p className="text-2xl font-black text-dashboard-text mt-1">
                {loading ? '...' : products.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <Loader className="animate-spin h-12 w-12 text-cyan-400 mx-auto mb-4" />
            <p className="text-dashboard-text font-bold">CARGANDO PRODUCTOS...</p>
            <p className="text-dashboard-text-secondary text-sm mt-1">Buscando los mejores productos para ti</p>
          </div>
        </div>
      )}

      {/* Lista de productos */}
      {!loading && (
        <div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  producto={product}
                  usuarioId={usuarioId}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-dashboard-accent/20 rounded-xl border-2 border-dashboard-accent/30">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-dashboard-text text-xl font-black">NO SE ENCONTRARON PRODUCTOS</p>
              <p className="text-dashboard-text-secondary mt-2">
                {filters.search ? 
                  'Intenta ajustar los términos de búsqueda' : 
                  'No hay productos disponibles en este momento'
                }
              </p>
              {filters.search && (
                <button
                  onClick={() => setFilters({ ...filters, search: '' })}
                  className="mt-4 px-6 py-2 bg-cyan-600/20 text-cyan-400 rounded-lg border border-cyan-500/30 hover:bg-cyan-600/30 transition-colors"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;