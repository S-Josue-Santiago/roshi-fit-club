// roshi_fit/src/pages/dashboard/products/ProductList.tsx
import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../../../api/productApi';
import { type Product, type ProductFilters } from '../../../types/Product';
import ProductFiltersComponent from './ProductFilters';
import ProductActions from './ProductActions';
import CreateProductModal from './CreateProductModal';
import EditProductModal from './EditProductModal';
import ManageStockModal from './ManageStockModal';
import { Package, Image, Tag, DollarSign, Box, Activity } from 'lucide-react';

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
      ? <span className="text-green-600 font-bold bg-green-600/20 px-3 py-1 rounded-full border border-green-600/30">✅ Activo</span>
      : <span className="text-yellow-600 font-bold bg-yellow-600/20 px-3 py-1 rounded-full border border-yellow-600/30">⏸️ Inactivo</span>;
  };

  const formatPrice = (precio: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2
    }).format(precio);
  };

  return (
    <div className="
      bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent
      shadow-lg hover:shadow-xl transition-all duration-300
    ">
      <ProductFiltersComponent onFilterChange={setFilters} onAddProduct={handleAddProduct} />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dashboard-primary"></div>
        </div>
      ) : (
        <div className="overflow-x-auto mt-6">
          {/* Tabla responsiva */}
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-dashboard-accent/50 rounded-lg bg-dashboard-accent/10">
              <table className="min-w-full divide-y divide-dashboard-accent/30">
                <thead className="bg-dashboard-accent/50">
                  <tr>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-sm sm:text-base 
                      font-black text-dashboard-text uppercase tracking-wider
                      border-r border-dashboard-accent/30
                    ">
                      <div className="flex items-center gap-2">
                        <Image size={18} className="text-dashboard-text" />
                        IMAGEN
                      </div>
                    </th>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-sm sm:text-base 
                      font-black text-dashboard-text uppercase tracking-wider
                      border-r border-dashboard-accent/30
                    ">
                      <div className="flex items-center gap-2">
                        <Package size={18} className="text-dashboard-text" />
                        NOMBRE
                      </div>
                    </th>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-sm sm:text-base 
                      font-black text-dashboard-text uppercase tracking-wider
                      border-r border-dashboard-accent/30
                    ">
                      <div className="flex items-center gap-2">
                        <Tag size={18} className="text-dashboard-text" />
                        CATEGORÍA
                      </div>
                    </th>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-sm sm:text-base 
                      font-black text-dashboard-text uppercase tracking-wider
                      border-r border-dashboard-accent/30
                    ">
                      <div className="flex items-center gap-2">
                        <DollarSign size={18} className="text-dashboard-text" />
                        PRECIO
                      </div>
                    </th>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-sm sm:text-base 
                      font-black text-dashboard-text uppercase tracking-wider
                      border-r border-dashboard-accent/30
                    ">
                      <div className="flex items-center gap-2">
                        <Box size={18} className="text-dashboard-text" />
                        STOCK
                      </div>
                    </th>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-sm sm:text-base 
                      font-black text-dashboard-text uppercase tracking-wider
                      border-r border-dashboard-accent/30
                    ">
                      <div className="flex items-center gap-2">
                        <Activity size={18} className="text-dashboard-text" />
                        ESTADO
                      </div>
                    </th>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-sm sm:text-base 
                      font-black text-dashboard-text uppercase tracking-wider
                    ">
                      ACCIONES
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashboard-accent/20">
                  {products.map((product) => (
                    <tr 
                      key={product.id} 
                      className="
                        transition-all duration-300 
                        hover:bg-black hover:bg-opacity-80
                        hover:scale-105 hover:shadow-2xl
                        group bg-dashboard-accent/5
                      "
                    >
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap
                        border-r border-dashboard-accent/30
                      ">
                        {product.imagen_principal ? (
                          <img
                            src={`/assets/products/${product.imagen_principal}`}
                            alt={product.nombre}
                            className="
                              w-14 h-14 object-cover rounded-lg border-2 border-dashboard-accent/50
                              group-hover:border-dashboard-primary transition-all duration-300
                              group-hover:scale-110
                            "
                            onError={(e) => (e.currentTarget.src = '/assets/placeholder.jpg')}
                          />
                        ) : (
                          <div className="
                            w-14 h-14 bg-dashboard-accent rounded-lg flex items-center justify-center 
                            text-dashboard-text-secondary group-hover:text-white
                            border-2 border-dashboard-accent/50 group-hover:border-dashboard-primary
                            transition-all duration-300
                          ">
                            <Image size={24} />
                          </div>
                        )}
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-sm sm:text-base 
                        text-dashboard-text font-semibold group-hover:text-white
                        transition-colors duration-300 border-r border-dashboard-accent/30
                      ">
                        {product.nombre}
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-sm sm:text-base 
                        text-dashboard-text-secondary group-hover:text-white
                        transition-colors duration-300 border-r border-dashboard-accent/30
                      ">
                        {product.categorias_producto?.nombre || (
                          <span className="text-dashboard-text-secondary/50 italic">
                            Sin categoría
                          </span>
                        )}
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-sm sm:text-base 
                        text-dashboard-text font-bold group-hover:text-white
                        transition-colors duration-300 border-r border-dashboard-accent/30
                      ">
                        {formatPrice(product.precio_venta_q)}
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-sm sm:text-base font-bold
                        border-r border-dashboard-accent/30 group-hover:text-white
                        transition-colors duration-300
                        text-dashboard-text
                      ">
                        {product.stock ?? 0}
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-sm sm:text-base 
                        border-r border-dashboard-accent/30
                      ">
                        <div className="group-hover:scale-105 transition-transform duration-300">
                          {formatStatus(product.estado)}
                        </div>
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-sm sm:text-base
                      ">
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
            </div>
          </div>

          {products.length === 0 && !loading && (
            <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-dashboard-text text-xl font-black">No se encontraron productos</p>
              <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
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