// roshi_fit/src/components/common/ServicesCarousel.tsx
import React, { useState, useEffect } from 'react';
import { type Service } from '../../types/Service';
import { fetchTopServices } from '../../api/serviceApi';

const ServicesCarousel: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-text-gray text-lg">Cargando servicios...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-text-gray text-lg">No hay servicios disponibles.</p>
      </div>
    );
  }

  // Si hay ≤ 3, mostramos todos fijos
  if (services.length <= 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
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
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>

      {/* Controles de navegación */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10
                   bg-primary/80 hover:bg-primary text-white 
                   w-10 h-10 rounded-full flex items-center justify-center
                   shadow-lg transition-all duration-300"
      >
        <span className="text-xl font-bold">‹</span>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10
                   bg-primary/80 hover:bg-primary text-white 
                   w-10 h-10 rounded-full flex items-center justify-center
                   shadow-lg transition-all duration-300"
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
              ${index === currentIndex ? 'bg-primary scale-125' : 'bg-accent/60'}
            `}
          />
        ))}
      </div>
    </div>
  );
};

// Tarjeta individual con diseño mejorado
const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  return (
    <div className="
      bg-gradient-to-br from-accent to-secondary 
      rounded-xl overflow-hidden border border-accent/70
      shadow-xl hover:shadow-2xl transition-all duration-300
      hover:border-primary/50 bg-black
    ">
      {service.imagen ? (
        <div className="relative overflow-hidden">
          <img 
            src={`/assets/products/${service.imagen}`}
            alt={service.nombre}
            className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => (e.currentTarget.src = '/assets/placeholderservicios.png')}
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-secondary flex items-center justify-center text-text-gray">
          Sin imagen
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-text-light mb-2">{service.nombre}</h3>
        <p className="text-text-gray text-sm mb-3 line-clamp-2">{service.descripcion}</p>
        <p className="text-gold font-bold text-lg bg-gold/10 px-3 py-1 rounded-lg inline-block">
          Q{parseFloat((service.precio_q ?? '0').toString()).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ServicesCarousel;