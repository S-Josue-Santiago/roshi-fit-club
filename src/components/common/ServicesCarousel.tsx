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
    if (services.length <= 3) return; // No necesita carrusel

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, [services.length]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-text-gray">Cargando servicios...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-text-gray">No hay servicios disponibles.</p>
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
    <div className="relative overflow-hidden">
      <div className="flex justify-center gap-6 transition-transform duration-500 ease-in-out">
        {visibleServices.map((service, idx) => (
          <div key={`${service.id}-${idx}`} className="flex-shrink-0 w-full max-w-xs">
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Tarjeta individual
const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  return (
    <div className="bg-accent/50 rounded-xl overflow-hidden border border-accent shadow-lg">
      {service.imagen ? (
        <img
          src={`/assets/services/${service.imagen}`} // ← usa `imagen`
          alt={service.nombre}
          className="w-full h-48 object-cover"
          onError={(e) => (e.currentTarget.src = '/assets/placeholder.jpg')}
        />
      ) : (
        <div className="w-full h-48 bg-secondary flex items-center justify-center text-text-gray">
          Sin imagen
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold text-text-light mb-2">{service.nombre}</h3> {/* ← nombre */}
        <p className="text-text-gray text-sm mb-3 line-clamp-2">{service.descripcion}</p>
<p className="text-gold font-bold text-lg">
  Q{(parseFloat((service.precio_q ?? '0').toString()).toFixed(2))}
</p>
      </div>
    </div>
  );
};

export default ServicesCarousel;