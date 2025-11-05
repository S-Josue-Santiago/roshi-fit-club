// roshi_fit/src/pages/dashboard/client/products/ProductList.tsx
import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../../../../api/productApi';
import type { Product } from '../../../../types/Product';
import ProductCard from './ProductCard';
import { Search, Filter, Package, Loader, X, ShoppingBag } from 'lucide-react';
import { fetchCategoriesProducts } from '../../../../api/categoryApi';
import type { Category } from '../../../../types/Category';
import { useClientContext } from '../../../../contexts/ClientContext';

// Hook para detectar el tema del dashboard
const useDashboardThemeDetection = () => {
  const [detectedTheme, setDetectedTheme] = useState<'nocturno' | 'amanecer'>('nocturno');

  useEffect(() => {
    const checkTheme = () => {
      const bodyClass = document.body.className;
      if (bodyClass.includes('theme-dashboard-amanecer')) {
        setDetectedTheme('amanecer');
      } else {
        setDetectedTheme('nocturno');
      }
    };

    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return detectedTheme;
};

const ProductList: React.FC = () => {
  const theme = useDashboardThemeDetection();
  const { usuarioId, onAddToCart } = useClientContext();
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

  // Estilos según tema
  const getStyles = () => {
    if (theme === 'amanecer') {
      return {
        header: 'text-gray-900',
        headerSubtext: 'text-gray-600',
        headerIcon: 'bg-blue-100 text-blue-600',
        filterContainer: 'bg-white border-slate-300',
        filterContainerShadow: '0 10px 30px rgba(74, 144, 226, 0.1)',
        label: 'text-gray-800',
        labelIcon: 'text-blue-500',
        input: 'bg-white text-gray-900 border-slate-300 focus:border-blue-500',
        inputIcon: 'text-gray-500',
        select: 'bg-white text-gray-900 border-slate-300 focus:border-blue-500',
        counterBg: 'bg-blue-100 border-blue-400 text-blue-700',
        counterNumber: 'text-gray-900',
        loadingSpinner: 'text-blue-500',
        loadingText: 'text-gray-900',
        loadingSubtext: 'text-gray-600',
        emptyContainer: 'bg-white border-slate-300',
        emptyIcon: 'text-gray-400',
        emptyTitle: 'text-gray-900',
        emptyText: 'text-gray-600',
        clearButton: 'bg-blue-100 text-blue-600 border-blue-400 hover:bg-blue-200'
      };
    }
    
    // Tema Nocturno
    return {
      header: 'text-white',
      headerSubtext: 'text-[#B0BEC5]',
      headerIcon: 'bg-cyan-500/20 text-cyan-400',
      filterContainer: 'bg-[#16213E]/50 border-purple-500/30',
      filterContainerShadow: '0 10px 30px rgba(138, 43, 226, 0.2)',
      label: 'text-white',
      labelIcon: 'text-cyan-400',
      input: 'bg-[#0A0E27] text-white border-purple-500/30 focus:border-cyan-500',
      inputIcon: 'text-[#B0BEC5]',
      select: 'bg-[#0A0E27] text-white border-purple-500/30 focus:border-cyan-500',
      counterBg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400',
      counterNumber: 'text-white',
      loadingSpinner: 'text-cyan-400',
      loadingText: 'text-white',
      loadingSubtext: 'text-[#B0BEC5]',
      emptyContainer: 'bg-[#16213E]/50 border-purple-500/30',
      emptyIcon: 'text-purple-500/50',
      emptyTitle: 'text-white',
      emptyText: 'text-[#B0BEC5]',
      clearButton: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/30'
    };
  };

  const styles = getStyles();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-4 ${styles.headerIcon} rounded-2xl shadow-lg transform hover:scale-110 transition-all duration-300`}>
            <ShoppingBag size={32} />
          </div>
          <div>
            <h1 className={`text-3xl md:text-4xl font-black ${styles.header} tracking-tight`}>
              PRODUCTOS 
            </h1>
            <p className={`${styles.headerSubtext} text-sm md:text-base font-semibold mt-1`}>
              Explora nuestro catálogo completo
            </p>
          </div>
        </div>
      </div>

      {/* Filtros Mejorados */}
      <div 
        className={`${styles.filterContainer} p-6 md:p-8 rounded-3xl border-2`}
        style={{ boxShadow: styles.filterContainerShadow }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Búsqueda */}
          <div>
            <label 
              htmlFor="search_product" 
              className={`block text-sm font-black ${styles.label} mb-3 flex items-center gap-2`}
            >
              <Search size={18} className={styles.labelIcon} />
              BUSCAR PRODUCTO
            </label>
            <div className="relative">
              <Search 
                size={20} 
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${styles.inputIcon}`} 
              />
              <input
                id="search_product"
                name="search_product"
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Buscar por nombre..."
                className={`
                  w-full pl-12 pr-12 py-4 rounded-xl border-2 
                  transition-all duration-300 focus:outline-none focus:ring-2
                  ${styles.input}
                `}
              />
              {filters.search && (
                <button
                  onClick={() => setFilters({ ...filters, search: '' })}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${styles.inputIcon} hover:text-red-500 transition-colors`}
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Filtro de Categoría */}
          <div>
            <label 
              htmlFor="filter_category" 
              className={`block text-sm font-black ${styles.label} mb-3 flex items-center gap-2`}
            >
              <Filter size={18} className={styles.labelIcon} />
              CATEGORÍA
            </label>
            <div className="relative">
              <Filter 
                size={20} 
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${styles.inputIcon} pointer-events-none`} 
              />
              <select
                id="filter_category"
                name="filter_category"
                value={filters.categoria_id}
                onChange={(e) => setFilters({ ...filters, categoria_id: e.target.value })}
                disabled={categoriesLoading || !!categoriesError}
                className={`
                  w-full pl-12 pr-4 py-4 rounded-xl border-2 
                  transition-all duration-300 focus:outline-none focus:ring-2
                  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                  ${styles.select}
                `}
              >
                <option value="">Todas las categorías</option>
                {categoriesLoading ? (
                  <option value="" disabled>Cargando...</option>
                ) : categoriesError ? (
                  <option value="" disabled>{categoriesError}</option>
                ) : (
                  categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.nombre}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Contador de productos */}
          {/* <div className="flex items-end">
            <div 
              className={`${styles.counterBg} p-5 rounded-2xl border-2 w-full text-center transform hover:scale-105 transition-all duration-300`}
            >
              <p className={`text-sm font-black mb-1 flex items-center justify-center gap-2`}>
                <Package size={18} />
                ENCONTRADOS
              </p>
              <p className={`text-4xl font-black ${styles.counterNumber}`}>
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  products.length
                )}
              </p>
            </div>
          </div> */}
        </div>

        {/* Filtros activos */}
        {(filters.search || filters.categoria_id) && (
          <div className="mt-6 pt-6 border-t-2" style={{ borderColor: theme === 'amanecer' ? '#cbd5e1' : 'rgba(138, 43, 226, 0.3)' }}>
            <div className="flex flex-wrap gap-2">
              <span className={`text-sm font-bold ${styles.label}`}>Filtros activos:</span>
              {filters.search && (
                <span className={`px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-2 ${theme === 'amanecer' ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-400'}`}>
                  Búsqueda: "{filters.search}"
                  <button onClick={() => setFilters({ ...filters, search: '' })}>
                    <X size={14} />
                  </button>
                </span>
              )}
              {filters.categoria_id && (
                <span className={`px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-2 ${theme === 'amanecer' ? 'bg-purple-100 text-purple-700' : 'bg-purple-500/20 text-purple-400'}`}>
                  Categoría: {categories.find(c => c.id.toString() === filters.categoria_id)?.nombre}
                  <button onClick={() => setFilters({ ...filters, categoria_id: '' })}>
                    <X size={14} />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <Loader className={`animate-spin h-16 w-16 ${styles.loadingSpinner} mx-auto mb-4`} />
            <p className={`${styles.loadingText} text-xl font-black`}>CARGANDO PRODUCTOS...</p>
            <p className={`${styles.loadingSubtext} text-sm mt-2`}>
              Buscando los mejores productos para ti
            </p>
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
                  usuarioId={usuarioId!}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : (
            <div 
              className={`${styles.emptyContainer} text-center py-20 rounded-3xl border-2`}
              style={{ boxShadow: styles.filterContainerShadow }}
            >
              <div className={`text-8xl mb-6 ${styles.emptyIcon}`}>📦</div>
              <p className={`${styles.emptyTitle} text-2xl font-black mb-3`}>
                NO SE ENCONTRARON PRODUCTOS
              </p>
              <p className={`${styles.emptyText} text-base mb-6 max-w-md mx-auto`}>
                {filters.search ? 
                  'Intenta ajustar los términos de búsqueda o explora otras categorías' : 
                  'No hay productos disponibles en este momento'
                }
              </p>
              {(filters.search || filters.categoria_id) && (
                <button
                  onClick={() => setFilters({ search: '', categoria_id: '', estado: 'activo' })}
                  className={`px-6 py-3 rounded-xl font-bold border-2 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto ${styles.clearButton}`}
                >
                  <X size={18} />
                  Limpiar filtros
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