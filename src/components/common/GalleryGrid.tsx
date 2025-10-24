// roshi_fit/src/components/common/GalleryGrid.tsx
import React, { useState, useEffect } from 'react';
import { fetchActiveGalleryItems } from '../../api/galleryApi';
import { type GalleryItem } from '../../types/GalleryItem';

// Hook para detectar el tema actual
const useTheme = () => {
  const [theme, setTheme] = useState<'original' | 'futurista'>('original');

  useEffect(() => {
    const checkTheme = () => {
      const bodyClass = document.body.className;
      setTheme(bodyClass.includes('futurista') ? 'futurista' : 'original');
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return theme;
};

const GalleryGrid: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    fetchActiveGalleryItems()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getLoadingStyle = () => {
    return theme === 'futurista'
      ? 'text-gray-600 text-lg font-light'
      : 'text-gray-400 text-lg font-light';
  };

  if (loading) {
    return <p className={`${getLoadingStyle()} text-center py-10`}>Cargando galería...</p>;
  }

  if (items.length === 0) {
    return <p className={`${getLoadingStyle()} text-center py-10`}>No hay imágenes en la galería.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <GalleryCard key={item.id} item={item} theme={theme} />
      ))}
    </div>
  );
};

// Tarjeta individual con hover
const GalleryCard: React.FC<{ item: GalleryItem; theme: 'original' | 'futurista' }> = ({ item, theme }) => {
  const getCardStyle = () => {
    if (theme === 'futurista') {
      return {
        container: 'group relative overflow-hidden rounded-xl transition-all duration-300',
        containerStyle: {
          background: 'linear-gradient(315deg, #f0f4f8, #ffffff)',
          boxShadow: '-8px -8px 16px rgba(255, 255, 255, 0.8), 8px 8px 16px rgba(0, 120, 255, 0.15)',
          border: '2px solid rgba(0, 120, 255, 0.2)'
        },
        image: 'w-full h-full object-cover transition-all duration-500 group-hover:scale-110',
        titleContainer: 'absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-lg text-sm font-bold z-10 border border-white/50',
        descriptionOverlay: 'absolute inset-0 flex items-center justify-center p-4 bg-blue-500/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10',
        descriptionBox: 'text-gray-800 text-center font-semibold'
      };
    }
    // Tema Original
    return {
      container: 'group relative overflow-hidden rounded-xl transition-all duration-300',
      containerStyle: {
        background: 'linear-gradient(315deg, rgba(30, 30, 30, 0.95), rgba(45, 45, 45, 0.95))',
        boxShadow: '-8px -8px 16px rgba(20, 20, 20, 0.8), 8px 8px 16px rgba(80, 80, 80, 0.3)',
        border: '1px solid rgba(255, 107, 53, 0.2)'
      },
      image: 'w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-40',
      titleContainer: 'absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-bold z-10 border border-white/10',
      descriptionOverlay: 'absolute inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10',
      descriptionBox: 'bg-black/80 text-text-light text-center p-4 rounded-lg max-w-[90%]'
    };
  };

  const styles = getCardStyle();

  return (
    <div className={styles.container} style={styles.containerStyle}>
      <div className="h-64 relative">
        <img
          src={`../../../public/assets/products/${item.imagen_url}`}
          alt={item.titulo || 'Galería Roshi Fit'}
          className={styles.image}
          onError={(e) => (e.currentTarget.src = '/assets/placeholdergaleria.png')}
        />

        {/* Título: esquina superior izquierda */}
        {item.titulo && (
          <div className={styles.titleContainer}>
            {item.titulo}
          </div>
        )}

        {/* Descripción centrada en hover */}
        {item.descripcion && (
          <div className={styles.descriptionOverlay}>
            <div className={styles.descriptionBox}>
              <p className="text-sm">{item.descripcion}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryGrid;