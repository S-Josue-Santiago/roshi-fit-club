// roshi_fit/src/pages/dashboard/products/ProductList.tsx
import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../../../api/productApi';
import { type Product, type ProductFilters } from '../../../types/Product';
import ProductFiltersComponent from './ProductFilters';
import ProductActions from './ProductActions';
import CreateProductModal from './CreateProductModal';
import EditProductModal from './EditProductModal';
import ManageStockModal from './ManageStockModal';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    categoria_id: '',
    estado: ''
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [managingStock, setManagingStock] = useState<{ id: number; stock: number; name: string } | null>(null);


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

  const handleAddProduct = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setFilters({ search: '', categoria_id: '', estado: '' });
  };

  const handleEdit = (id: number) => {
    setEditingProductId(id);
  };

  const handleUpdateSuccess = () => {
    setFilters(prev => ({ ...prev }));
  };

  const formatStatus = (estado: string) => {
    return estado === 'activo' 
      ? <span className="text-green-400">✅ Activo</span>
      : <span className="text-yellow-400">⏸️ Inactivo</span>;
  };

  const formatPrice = (precio: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2
    }).format(precio);
  };

  return (
    <div className="bg-dashboard-accent/30 p-6 rounded-xl border border-dashboard-accent">
      <ProductFiltersComponent onFilterChange={setFilters} onAddProduct={handleAddProduct} />

      {loading ? (
        <p className="text-dashboard-text py-6 text-center">Cargando productos...</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-dashboard-text">
            <thead>
              <tr className="border-b border-dashboard-accent">
                <th className="py-3 px-4 text-left">IMAGEN</th>
                <th className="py-3 px-4 text-left">NOMBRE</th>
                <th className="py-3 px-4 text-left">CATEGORÍA</th>
                <th className="py-3 px-4 text-left">PRECIO</th>
                <th className="py-3 px-4 text-left">STOCK</th>
                <th className="py-3 px-4 text-left">ESTADO</th>
                <th className="py-3 px-4 text-left">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-dashboard-accent/50 hover:bg-dashboard-accent/20">
                  <td className="py-3 px-4">
                    {product.imagen_principal ? (
                      <img
                        src={`/assets/products/${product.imagen_principal}`}
                        alt={product.nombre}
                        className="w-12 h-12 object-cover rounded border border-dashboard-accent"
                        onError={(e) => (e.currentTarget.src = '/assets/placeholder.jpg')}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-dashboard-accent rounded flex items-center justify-center text-xs">
                        —
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium">{product.nombre}</td>
                  <td className="py-3 px-4 text-dashboard-text-secondary">
                    {product.categorias_producto?.nombre || '—'}
                  </td>
                  <td className="py-3 px-4 text-dashboard-primary font-bold">
                    {formatPrice(product.precio_venta_q)}
                  </td>
                  <td className={`py-3 px-4 ${product.stock === 0 ? 'text-red-400 font-bold' : ''}`}>
                    {product.stock ?? 0}
                  </td>
                  <td className="py-3 px-4">{formatStatus(product.estado)}</td>
                  <td className="py-3 px-4">
                    <ProductActions
                      product={product}
                      onEdit={handleEdit}
                        onManageStock={(id, stock, name) => setManagingStock({ id, stock, name })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && !loading && (
            <p className="text-dashboard-text text-center py-6">No se encontraron productos.</p>
          )}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateProductModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateSuccess}
        />
      )}

      {editingProductId && (
        <EditProductModal
          productId={editingProductId}
          onClose={() => setEditingProductId(null)}
          onUpdate={handleUpdateSuccess}
        />
      )}

      {managingStock && (
        <ManageStockModal
          productId={managingStock.id}
          currentStock={managingStock.stock}
          productName={managingStock.name}
          onClose={() => setManagingStock(null)}
          onUpdate={() => setFilters(prev => ({ ...prev }))}
        />
      )}
    </div>
  );
};

export default ProductList;