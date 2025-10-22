// roshi_fit/src/components/common/GalleryGrid.tsx
import React, { useState, useEffect } from 'react';
import { fetchActiveGalleryItems } from '../../api/galleryApi';
import { type GalleryItem } from '../../types/GalleryItem';

const GalleryGrid: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveGalleryItems()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-text-gray text-center py-6">Cargando galería...</p>;
  }

  if (items.length === 0) {
    return <p className="text-text-gray text-center py-6">No hay imágenes en la galería.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <GalleryCard key={item.id} item={item} />
      ))}
    </div>
  );
};

// Tarjeta individual con hover
const GalleryCard: React.FC<{ item: GalleryItem }> = ({ item }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-accent shadow-lg bg-black">
      <div className="h-64 relative">
        <img
          src={`../../../public/assets/products/${item.imagen_url}`}
          alt={item.titulo || 'Galería Roshi Fit'}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-40"
          onError={(e) => (e.currentTarget.src = '/assets/placeholdergaleria.png')}
        />

        {/* Título: esquina superior izquierda */}
        {item.titulo && (
          <div className="absolute top-3 left-3 bg-black/60 text-text-light px-2 py-1 rounded text-sm font-bold z-10">
            {item.titulo}
          </div>
        )}

        {/* Descripción centrada en hover */}
        {item.descripcion && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <div className="bg-black/80 text-text-light text-center p-4 rounded-lg max-w-[90%]">
              <p className="text-sm">{item.descripcion}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryGrid;