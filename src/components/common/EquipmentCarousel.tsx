// roshi_fit/src/components/common/EquipmentCarousel.tsx
import React, { useState, useEffect } from 'react';
import { fetchActiveEquipment } from '../../api/equipmentApi';
import { type Equipment } from '../../types/Equipment';

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

const EquipmentCarousel: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    fetchActiveEquipment()
      .then(setEquipment)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % equipment.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + equipment.length) % equipment.length);
  };

  const getLoadingStyle = () => {
    return theme === 'futurista'
      ? 'text-gray-600 text-lg font-light'
      : 'text-gray-400 text-lg font-light';
  };

  if (loading) {
    return <p className={`${getLoadingStyle()} text-center py-10`}>Cargando equipos...</p>;
  }

  if (equipment.length === 0) {
    return <p className={`${getLoadingStyle()} text-center py-10`}>No hay equipos disponibles.</p>;
  }

  // Mostrar todos si ≤ 3
  if (equipment.length <= 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {equipment.map((item) => (
          <EquipmentCard key={item.id} item={item} theme={theme} />
        ))}
      </div>
    );
  }

  // Carrusel: 3 visibles
  const visibleItems = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex + i) % equipment.length;
    visibleItems.push(equipment[index]);
  }

  const getButtonStyle = () => {
    if (theme === 'futurista') {
      return {
        background: 'linear-gradient(135deg, #0078ff, #00d4ff)',
        boxShadow: '0 4px 15px rgba(0, 120, 255, 0.4)'
      };
    }
    return {
      background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)'
    };
  };

  const getIndicatorStyle = (isActive: boolean) => {
    if (theme === 'futurista') {
      return isActive 
        ? 'bg-blue-500 scale-125 shadow-lg shadow-blue-500/50' 
        : 'bg-blue-200';
    }
    return isActive 
      ? 'bg-primary scale-125 shadow-lg shadow-primary/50' 
      : 'bg-orange-300/60';
  };

  return (
    <div className="relative py-6">
      {/* Flechas */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10
                   text-white w-10 h-10 rounded-full flex items-center justify-center
                   transition-all duration-300 hover:scale-110"
        style={getButtonStyle()}
        aria-label="Anterior"
      >
        <span className="text-xl font-bold">‹</span>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10
                   text-white w-10 h-10 rounded-full flex items-center justify-center
                   transition-all duration-300 hover:scale-110"
        style={getButtonStyle()}
        aria-label="Siguiente"
      >
        <span className="text-xl font-bold">›</span>
      </button>

      {/* Carrusel */}
      <div className="flex justify-center gap-8 overflow-hidden px-10">
        {visibleItems.map((item, idx) => (
          <div 
            key={`${item.id}-${idx}`} 
            className={`
              flex-shrink-0 w-full max-w-xs transform transition-all duration-300
              ${idx === 1 ? 'scale-105' : 'scale-100'}
            `}
          >
            <EquipmentCard item={item} theme={theme} />
          </div>
        ))}
      </div>

      {/* Indicadores de posición */}
      <div className="flex justify-center mt-6 space-x-2">
        {equipment.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${getIndicatorStyle(index === currentIndex)}
            `}
          />
        ))}
      </div>
    </div>
  );
};

// Tarjeta individual
const EquipmentCard: React.FC<{ item: Equipment; theme: 'original' | 'futurista' }> = ({ item, theme }) => {
  const getCardStyle = () => {
    if (theme === 'futurista') {
      return {
        container: 'rounded-xl overflow-hidden transition-all duration-300 hover:scale-105',
        containerStyle: {
          background: 'linear-gradient(315deg, #f0f4f8, #ffffff)',
          boxShadow: '-8px -8px 16px rgba(255, 255, 255, 0.8), 8px 8px 16px rgba(0, 120, 255, 0.15)',
          border: '2px solid rgba(0, 120, 255, 0.2)'
        },
        titleContainer: 'absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-lg text-sm font-bold z-10 border border-white/50',
        typeContainer: 'absolute bottom-3 left-3 bg-blue-500/90 text-white px-3 py-1 rounded-lg text-xs font-semibold z-10',
        placeholderBg: 'linear-gradient(135deg, #e8f0f7, #f0f4f8)',
        placeholderText: 'text-gray-500'
      };
    }
    return {
      container: 'rounded-xl overflow-hidden transition-all duration-300 hover:scale-105',
      containerStyle: {
        background: 'linear-gradient(315deg, rgba(30, 30, 30, 0.95), rgba(45, 45, 45, 0.95))',
        boxShadow: '-8px -8px 16px rgba(20, 20, 20, 0.8), 8px 8px 16px rgba(80, 80, 80, 0.3)',
        border: '1px solid rgba(255, 107, 53, 0.2)'
      },
      titleContainer: 'absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-bold z-10 border border-white/10',
      typeContainer: 'absolute bottom-3 left-3 bg-primary/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-semibold z-10 border border-white/10',
      placeholderBg: 'linear-gradient(135deg, #2d2d44, #1a1a2e)',
      placeholderText: 'text-text-gray'
    };
  };

  const styles = getCardStyle();

  return (
    <div className={styles.container} style={styles.containerStyle}>
      <div className="relative h-64"> {/* 16:9 aproximado */}
        {item.imagen ? (
          <img
            src={`../../../public/assets/products/${item.imagen}`}
            alt={item.nombre}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = '/assets/placeholdermaquinas.png')} // Fallback
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${styles.placeholderText}`} style={{ background: styles.placeholderBg }}>
            Sin imagen
          </div>
        )}

        {/* Nombre: esquina superior izquierda */}
        <div className={styles.titleContainer}>
          {item.nombre}
        </div>

        {/* Tipo: esquina inferior izquierda */}
        {item.tipo && (
          <div className={styles.typeContainer}>
            {item.tipo}
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentCarousel;