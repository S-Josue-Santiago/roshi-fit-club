// roshi_fit/src/pages/dashboard/gallery/GalleryList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { fetchGalleryItems, toggleGalleryItemStatus } from '../../../api/galleryApi';
import type { GalleryItem, GalleryItemFilters } from '../../../types/GalleryItem';
import GalleryFiltersComponent from './GalleryFilters';
import GalleryActions from './GalleryActions';
import CreateGalleryItemModal from './CreateGalleryItemModal';
import EditGalleryItemModal from './EditGalleryItemModal';
import { Image, Type, Activity, Tag } from 'lucide-react';

const GalleryList: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<GalleryItemFilters>({
    search: '',
    categoria: '',
    estado: ''
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // New state to force data reload

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchGalleryItems(filters);
      setItems(data);
    } catch (error) {
      console.error('Error al cargar galería:', error);
      alert(`Error al cargar la galería: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }, [filters, refreshTrigger]); // Add refreshTrigger to dependencies

  useEffect(() => {
    loadItems();
  }, [loadItems, refreshTrigger]); // Add refreshTrigger to dependencies

  const handleAddItem = () => setIsCreateModalOpen(true);
  const handleCreateSuccess = () => {
    loadItems(); // Reload all items after creation
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  }
  const handleEdit = (id: number) => setEditingItemId(id);
  const handleUpdateSuccess = () => {
    loadItems(); // Reload all items after update
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  }

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleGalleryItemStatus(id);
      loadItems(); // Reload items to reflect the status change
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
    } catch (error) {
      console.error('Error toggling gallery item status:', error);
      alert(`Error al cambiar el estado del item de galería: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const formatStatus = (estado: string) => {
    return estado === 'activo'
      ? <span className="text-green-600 font-bold bg-green-600/20 px-3 py-1 rounded-full border border-green-600/30">✅ Activo</span>
      : <span className="text-yellow-600 font-bold bg-yellow-600/20 px-3 py-1 rounded-full border border-yellow-600/30">⏸️ Inactivo</span>;
  };

  return (
    <div className="
      bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent
      shadow-lg hover:shadow-xl transition-all duration-300
    ">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-pink-600/20 rounded-lg">
          <Image size={24} className="text-pink-400" />
        </div>
        <h1 className="text-2xl font-black text-dashboard-text">GALERÍA</h1>
      </div>

      <GalleryFiltersComponent onFilterChange={setFilters} onAddItem={handleAddItem} />

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
                      <div className="flex items-center gap-2"><Image size={16} className="text-pink-400" />IMAGEN</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2"><Type size={16} className="text-pink-400" />TÍTULO</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2"><Tag size={16} className="text-pink-400" />CATEGORÍA</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2"><Activity size={16} className="text-pink-400" />ESTADO</div>
                    </th>
                    <th scope="col" className="px-4 py-4 text-left text-sm font-black text-dashboard-text uppercase tracking-wider">
                      ACCIONES
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashboard-accent/20">
                  {items.map(item => (
                    <tr key={item.id} className="transition-all duration-300 hover:bg-black hover:bg-opacity-80 group bg-dashboard-accent/5">
                      <td className="px-4 py-4 whitespace-nowrap border-r border-dashboard-accent/30">
                        <img
                          src={`/assets/gallery/${item.imagen_url}`}
                          alt={item.titulo || 'Galería'}
                          className="w-16 h-16 object-cover rounded-lg border-2 border-dashboard-accent/50 group-hover:border-pink-500 transition-all duration-300 group-hover:scale-110"
                          onError={(e) => (e.currentTarget.src = '/assets/placeholdergaleria.png')}
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-dashboard-text group-hover:text-white border-r border-dashboard-accent/30">
                        {item.titulo || <span className="italic text-dashboard-text-secondary/50">Sin título</span>}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-dashboard-text-secondary group-hover:text-white border-r border-dashboard-accent/30">
                        {item.categoria || <span className="italic text-dashboard-text-secondary/50">Sin categoría</span>}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm border-r border-dashboard-accent/30">
                        <div className="group-hover:scale-105 transition-transform duration-300">
                          {formatStatus(item.estado)}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <GalleryActions
                          item={item}
                          onEdit={handleEdit}
                          onToggleStatus={handleToggleStatus}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {items.length === 0 && !loading && (
            <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-dashboard-text text-xl font-black">No se encontraron items en la galería</p>
              <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
                Intenta ajustar los filtros de búsqueda o crea un nuevo item.
              </p>
            </div>
          )}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateGalleryItemModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateSuccess}
        />
      )}

      {editingItemId && (
        <EditGalleryItemModal
          itemId={editingItemId}
          onClose={() => setEditingItemId(null)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default GalleryList;