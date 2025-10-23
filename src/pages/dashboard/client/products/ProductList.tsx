// roshi_fit/src/pages/dashboard/client/products/ProductList.tsx
import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../../../../api/productApi';
import type { Product } from '../../../../types/Product';
import ProductCard from './ProductCard';

interface ProductListProps {
  usuarioId: number;
  onAddToCart: () => void; // ✅ Requerido
}

const ProductList: React.FC<ProductListProps> = ({ usuarioId, onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    categoria_id: '',
    estado: 'activo'
  });

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
    <div>
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar producto..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="flex-1 p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
        />
        <select
          value={filters.categoria_id}
          onChange={(e) => setFilters({ ...filters, categoria_id: e.target.value })}
          className="p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
        >
          <option value="">Todas las categorías</option>
          {/* Cargar categorías dinámicamente si es necesario */}
        </select>
      </div>

      {/* Lista de productos */}
      {loading ? (
        <p className="text-dashboard-text">Cargando productos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              producto={product}
              usuarioId={usuarioId}
              onAddToCart={onAddToCart} // ✅ Pasado
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;