// roshi_fit/src/pages/dashboard/categories/CategoryList.tsx
import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../../../api/categoryApi';
import { type Category, type CategoryFilters } from '../../../types/Category';
import CategoryFiltersComponent from './CategoryFilters';
import CategoryActions from './CategoryActions';
import CreateCategoryModal from './CreateCategoryModal';
import EditCategoryModal from './EditCategoryModal';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CategoryFilters>({ search: '', estado: '' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchCategories(filters);
        setCategories(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, [filters]);

  const handleAddCategory = () => setIsCreateModalOpen(true);
  const handleCreateSuccess = () => setFilters({ search: '', estado: '' });
  const handleEdit = (id: number) => setEditingCategoryId(id);
  const handleUpdateSuccess = () => setFilters(prev => ({ ...prev }));

  const formatStatus = (estado: string) => {
    return estado === 'activo' 
      ? <span className="text-green-400">✅ Activo</span>
      : <span className="text-yellow-400">⏸️ Inactivo</span>;
  };

  return (
    <div className="bg-dashboard-accent/30 p-6 rounded-xl border border-dashboard-accent">
      <CategoryFiltersComponent onFilterChange={setFilters} onAddCategory={handleAddCategory} />

      {loading ? (
        <p className="text-dashboard-text py-6 text-center">Cargando categorías...</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-dashboard-text">
            <thead>
              <tr className="border-b border-dashboard-accent">
                <th className="py-3 px-4 text-left">NOMBRE</th>
                <th className="py-3 px-4 text-left">DESCRIPCIÓN</th>
                <th className="py-3 px-4 text-left">ESTADO</th>
                <th className="py-3 px-4 text-left">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id} className="border-b border-dashboard-accent/50 hover:bg-dashboard-accent/20">
                  <td className="py-3 px-4 font-medium">{category.nombre}</td>
                  <td className="py-3 px-4 text-dashboard-text-secondary max-w-xs truncate">
                    {category.descripcion || '—'}
                  </td>
                  <td className="py-3 px-4">{formatStatus(category.estado)}</td>
                  <td className="py-3 px-4">
                    <CategoryActions
                      category={category}
                      onEdit={handleEdit}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {categories.length === 0 && !loading && (
            <p className="text-dashboard-text text-center py-6">No se encontraron categorías.</p>
          )}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateCategoryModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateSuccess}
        />
      )}

      {editingCategoryId && (
        <EditCategoryModal
          categoryId={editingCategoryId}
          onClose={() => setEditingCategoryId(null)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default CategoryList;