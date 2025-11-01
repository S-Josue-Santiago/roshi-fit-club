// roshi_fit/src/pages/dashboard/categories/CategoryList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { fetchCategories, toggleCategoryStatus } from '../../../api/categoryApi';
import { type Category, type CategoryFilters } from '../../../types/Category';
import CategoryFiltersComponent from './CategoryFilters';
import CategoryActions from './CategoryActions';
import CreateCategoryModal from './CreateCategoryModal';
import EditCategoryModal from './EditCategoryModal';
import { BarChart3, Tag, FileText, Activity } from 'lucide-react';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CategoryFilters>({ search: '', estado: '' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // New state to force data reload

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCategories(filters);
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      alert(`Error al cargar categorías: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }, [filters, refreshTrigger]); // Add refreshTrigger to dependencies

  useEffect(() => {
    loadCategories();
  }, [loadCategories, refreshTrigger]); // Add refreshTrigger to dependencies

  const handleAddCategory = () => setIsCreateModalOpen(true);
  const handleCreateSuccess = () => {
    loadCategories(); // Reload all categories after creation
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  }
  const handleEdit = (id: number) => setEditingCategoryId(id);
  const handleUpdateSuccess = () => {
    loadCategories(); // Reload all categories after update
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  }

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleCategoryStatus(id);
      loadCategories(); // Reload categories to reflect the status change
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
    } catch (error) {
      console.error('Error toggling category status:', error);
      alert(`Error al cambiar el estado de la categoría: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const formatStatus = (estado: string) => {
    const statusMap: Record<string, { color: string; bg: string; text: string }> = {
      activo: { color: 'text-green-400', bg: 'bg-green-600/20', text: 'Activo' },
      inactivo: { color: 'text-yellow-400', bg: 'bg-yellow-600/20', text: 'Inactivo' },
    };
    const status = statusMap[estado] || { color: 'text-gray-400', bg: 'bg-gray-600/20', text: 'Desconocido' };
    return (
      <span className={`${status.color} ${status.bg} px-3 py-1 rounded-full text-xs font-bold border border-current/30 capitalize`}>
        {status.text}
      </span>
    );
  };

  return (
    <div className="bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-600/20 rounded-lg">
          <BarChart3 size={24} className="text-green-400" />
        </div>
        <h1 className="text-2xl font-black text-dashboard-text">CATEGORÍAS DE PRODUCTOS</h1>
      </div>

      <CategoryFiltersComponent onFilterChange={setFilters} onAddCategory={handleAddCategory} />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dashboard-primary"></div>
        </div>
      ) : (
        <div className="overflow-x-auto mt-6">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-dashboard-accent/50 rounded-lg bg-dashboard-accent/10">
              <table className="min-w-full divide-y divide-dashboard-accent/30">
                <thead className="bg-dashboard-accent/50">
                  <tr>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2"><Tag size={18} className="text-green-400" />NOMBRE</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2"><FileText size={18} className="text-green-400" />DESCRIPCIÓN</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2"><Activity size={18} className="text-green-400" />ESTADO</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider">
                      ACCIONES
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashboard-accent/20">
                  {categories.map(category => (
                    <tr key={category.id} className="transition-all duration-300 hover:bg-black hover:bg-opacity-80 hover:shadow-2xl group bg-dashboard-accent/5">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-dashboard-text group-hover:text-white border-r border-dashboard-accent/30">
                        {category.nombre}
                      </td>
                      <td className="px-4 py-4 text-sm text-dashboard-text-secondary group-hover:text-white border-r border-dashboard-accent/30 max-w-sm truncate">
                        {category.descripcion || <span className="italic text-dashboard-text-secondary/50">Sin descripción</span>}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm border-r border-dashboard-accent/30">
                        {formatStatus(category.estado)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <CategoryActions
                          category={category}
                          onEdit={handleEdit}
                          onToggleStatus={handleToggleStatus} // Pass the new handler
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {categories.length === 0 && !loading && (
            <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-dashboard-text text-xl font-black">No se encontraron categorías</p>
              <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
                Intenta ajustar los filtros de búsqueda o crea una nueva.
              </p>
            </div>
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