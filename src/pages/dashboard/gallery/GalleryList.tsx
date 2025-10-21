// roshi_fit/src/pages/dashboard/gallery/GalleryList.tsx
import React, { useState, useEffect } from 'react';
import { fetchGalleryItems } from '../../../api/galleryApi';
import type { GalleryItem, GalleryItemFilters } from '../../../types/GalleryItem';
import GalleryFiltersComponent from './GalleryFilters';
import GalleryActions from './GalleryActions';
import CreateGalleryItemModal from './CreateGalleryItemModal';
import EditGalleryItemModal from './EditGalleryItemModal';

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

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const data = await fetchGalleryItems(filters);
        setItems(data);
      } catch (error) {
        console.error('Error al cargar galería:', error);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, [filters]);

  const handleAddItem = () => setIsCreateModalOpen(true);
  const handleCreateSuccess = () => setFilters({ search: '', categoria: '', estado: '' });
  const handleEdit = (id: number) => setEditingItemId(id);
  const handleUpdateSuccess = () => setFilters(prev => ({ ...prev }));

  const formatStatus = (estado: string) => {
    return estado === 'activo' 
      ? <span className="text-green-400">✅ Activo</span>
      : <span className="text-yellow-400">⏸️ Inactivo</span>;
  };

  return (
    <div className="bg-dashboard-accent/30 p-6 rounded-xl border border-dashboard-accent">
      <GalleryFiltersComponent onFilterChange={setFilters} onAddItem={handleAddItem} />

      {loading ? (
        <p className="text-dashboard-text py-6 text-center">Cargando galería...</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-dashboard-text">
            <thead>
              <tr className="border-b border-dashboard-accent">
                <th className="py-3 px-4 text-left">IMAGEN</th>
                <th className="py-3 px-4 text-left">TÍTULO</th>
                <th className="py-3 px-4 text-left">CATEGORÍA</th>
                <th className="py-3 px-4 text-left">ESTADO</th>
                <th className="py-3 px-4 text-left">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-dashboard-accent/50 hover:bg-dashboard-accent/20">
                  <td className="py-3 px-4">
                    <img
                      src={`/assets/products/${item.imagen_url}`} 
                      alt={item.titulo || 'Galería'}
                      className="w-16 h-16 object-cover rounded border border-dashboard-accent"
                      onError={(e) => (e.currentTarget.src = '/public/assets/placeholder.jpg')}
                    />
                  </td>
                  <td className="py-3 px-4 font-medium">{item.titulo || '—'}</td>
                  <td className="py-3 px-4">{item.categoria || '—'}</td>
                  <td className="py-3 px-4">{formatStatus(item.estado)}</td>
                  <td className="py-3 px-4 ">
                    <GalleryActions
                      item={item}
                      onEdit={handleEdit}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {items.length === 0 && !loading && (
            <p className="text-dashboard-text text-center py-6">No se encontraron items.</p>
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