// roshi_fit/src/components/common/ServicesCarousel.tsx
import React, { useState, useEffect } from 'react';
import { type Service } from '../../types/Service';
import { fetchTopServices } from '../../api/serviceApi';

// Hook para detectar el tema actual
const useTheme = () => {
  const [theme, setTheme] = useState<'original' | 'futurista'>('original');

  useEffect(() => {
    // Detectar tema basado en clases del body o localStorage
    const checkTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      const bodyClass = document.body.className;
      
      if (savedTheme === 'futurista' || bodyClass.includes('futurista')) {
        setTheme('futurista');
      } else {
        setTheme('original');
      }
    };

    checkTheme();
    
    // Observar cambios en el body
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return theme;
};

const ServicesCarousel: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  // Cargar servicios
  useEffect(() => {
    fetchTopServices()
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Carrusel automático
  useEffect(() => {
    if (services.length <= 3) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [services.length]);

  // Navegación manual
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  // Estilos según tema
  const getLoadingStyle = () => {
    if (theme === 'futurista') {
      return 'text-gray-600 text-lg font-light';
    }
    return 'text-gray-400 text-lg font-light';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <p className={getLoadingStyle()}>Cargando servicios...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-10">
        <p className={getLoadingStyle()}>No hay servicios disponibles.</p>
      </div>
    );
  }

  // Si hay ≤ 3, mostramos todos fijos
  if (services.length <= 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} theme={theme} />
        ))}
      </div>
    );
  }

  // Si hay > 3, carrusel: mostramos 3 a la vez
  const visibleServices = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex + i) % services.length;
    visibleServices.push(services[index]);
  }

  // Estilos de botones según tema
  const getButtonStyle = () => {
    if (theme === 'futurista') {
      return {
        background: 'linear-gradient(135deg, #0078ff, #00d4ff)',
        boxShadow: '0 4px 15px rgba(0, 120, 255, 0.4), -3px -3px 8px rgba(0, 212, 255, 0.2), 3px 3px 8px rgba(0, 120, 255, 0.5)'
      };
    }
    return {
      background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4), -3px -3px 8px rgba(255, 140, 66, 0.2), 3px 3px 8px rgba(255, 107, 53, 0.5)'
    };
  };

  // Estilos de indicadores según tema
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
      {/* Contenedor del carrusel */}
      <div className="relative overflow-hidden px-10">
        <div className="flex justify-center gap-6 transition-all duration-500 ease-out">
          {visibleServices.map((service, idx) => (
            <div 
              key={`${service.id}-${idx}`} 
              className={`
                flex-shrink-0 w-full max-w-xs transform transition-all duration-300
                ${idx === 1 ? 'scale-105' : 'scale-100'}
              `}
            >
              <ServiceCard service={service} theme={theme} />
            </div>
          ))}
        </div>
      </div>

      {/* Controles de navegación */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10
                   text-white w-10 h-10 rounded-full flex items-center justify-center
                   transition-all duration-300 hover:scale-110"
        style={getButtonStyle()}
      >
        <span className="text-xl font-bold">‹</span>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10
                   text-white w-10 h-10 rounded-full flex items-center justify-center
                   transition-all duration-300 hover:scale-110"
        style={getButtonStyle()}
      >
        <span className="text-xl font-bold">›</span>
      </button>

      {/* Indicadores de posición */}
      <div className="flex justify-center mt-6 space-x-2">
        {services.map((_, index) => (
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

// Tarjeta individual con diseño adaptable según tema
const ServiceCard: React.FC<{ service: Service; theme: 'original' | 'futurista' }> = ({ service, theme }) => {
  // Estilos según tema
  const getCardStyle = () => {
    if (theme === 'futurista') {
      return {
        container: 'rounded-xl overflow-hidden transition-all duration-300 hover:scale-105',
        containerStyle: {
          background: 'linear-gradient(315deg, rgba(255, 255, 255, 0.95), rgba(240, 244, 248, 0.95))',
          boxShadow: '-8px -8px 16px rgba(255, 255, 255, 0.8), 8px 8px 16px rgba(0, 120, 255, 0.15)',
          border: '2px solid rgba(0, 120, 255, 0.2)'
        },
        title: 'text-xl font-black text-gray-800 mb-2',
        description: 'text-gray-600 text-sm mb-3 line-clamp-2',
        price: 'text-blue-600 font-black text-lg px-3 py-1 rounded-lg inline-block',
        priceStyle: {
          background: 'linear-gradient(135deg, rgba(0, 120, 255, 0.1), rgba(0, 212, 255, 0.1))',
          boxShadow: '-2px -2px 4px rgba(255, 255, 255, 0.8), 2px 2px 4px rgba(0, 120, 255, 0.15)',
          border: '1px solid rgba(0, 120, 255, 0.2)'
        }
      };
    }
    return {
      container: 'rounded-xl overflow-hidden transition-all duration-300 hover:scale-105',
      containerStyle: {
        background: 'linear-gradient(315deg, rgba(30, 30, 30, 0.95), rgba(45, 45, 45, 0.95))',
        boxShadow: '-8px -8px 16px rgba(20, 20, 20, 0.8), 8px 8px 16px rgba(80, 80, 80, 0.3)',
        border: '1px solid rgba(255, 107, 53, 0.2)'
      },
      title: 'text-xl font-black text-white mb-2',
      description: 'text-gray-400 text-sm mb-3 line-clamp-2',
      price: 'text-orange-400 font-black text-lg px-3 py-1 rounded-lg inline-block',
      priceStyle: {
        background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.15), rgba(255, 140, 66, 0.15))',
        boxShadow: '-2px -2px 4px rgba(20, 20, 20, 0.5), 2px 2px 4px rgba(255, 107, 53, 0.3)',
        border: '1px solid rgba(255, 107, 53, 0.3)'
      }
    };
  };

  const styles = getCardStyle();

  return (
    <div className={styles.container} style={styles.containerStyle}>
      {service.imagen ? (
        <div className="relative overflow-hidden">
          <img 
            src={`/assets/products/${service.imagen}`}
            alt={service.nombre}
            className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
            onError={(e) => (e.currentTarget.src = '/assets/placeholderservicios.png')}
          />
          {/* Overlay según tema */}
          <div 
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background: theme === 'futurista' 
                ? 'linear-gradient(to top, rgba(0, 120, 255, 0.3), transparent)'
                : 'linear-gradient(to top, rgba(255, 107, 53, 0.3), transparent)'
            }}
          ></div>
        </div>
      ) : (
        <div 
          className="w-full h-48 flex items-center justify-center text-gray-500"
          style={{
            background: theme === 'futurista' 
              ? 'linear-gradient(135deg, #e8f0f7, #f0f4f8)' 
              : 'linear-gradient(135deg, #2d2d44, #1a1a2e)'
          }}
        >
          Sin imagen
        </div>
      )}
      
      <div className="p-5">
        <h3 className={styles.title}>{service.nombre}</h3>
        <p className={styles.description}>{service.descripcion}</p>
        <div className={styles.price} style={styles.priceStyle}>
          Q{parseFloat((service.precio_q ?? '0').toString()).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ServicesCarousel;