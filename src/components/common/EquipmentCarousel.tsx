// roshi_fit/src/components/common/EquipmentCarousel.tsx
import React, { useState, useEffect } from 'react';
import { fetchActiveEquipment } from '../../api/equipmentApi';
import { type Equipment } from '../../types/Equipment';

const EquipmentCarousel: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p className="text-text-gray text-center py-6">Cargando equipos...</p>;
  }

  if (equipment.length === 0) {
    return <p className="text-text-gray text-center py-6">No hay equipos disponibles.</p>;
  }

  // Mostrar todos si ≤ 3
  if (equipment.length <= 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {equipment.map((item) => (
          <EquipmentCard key={item.id} item={item} />
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

  return (
    <div className="relative">
      {/* Flechas */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-accent/70 hover:bg-accent text-text-light p-2 rounded-full"
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-accent/70 hover:bg-accent text-text-light p-2 rounded-full"
        aria-label="Siguiente"
      >
        ›
      </button>

      {/* Carrusel */}
      <div className="flex justify-center gap-8 overflow-hidden">
        {visibleItems.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="flex-shrink-0 w-full max-w-xs">
            <EquipmentCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Tarjeta individual
const EquipmentCard: React.FC<{ item: Equipment }> = ({ item }) => {
  return (
    <div className="bg-accent/50 rounded-xl overflow-hidden border border-accent shadow-lg">
      <div className="relative h-64"> {/* 16:9 aproximado */}
        {item.imagen ? (
          <img
            src={`../../../public/assets/equipment/${item.imagen}`}
            alt={item.nombre}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = '/assets/placeholder_equipment.jpg')}
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center text-text-gray">
            Sin imagen
          </div>
        )}

        {/* Nombre: esquina superior izquierda */}
        <div className="absolute top-3 left-3 bg-black/60 text-text-light px-2 py-1 rounded text-sm font-bold">
          {item.nombre}
        </div>

        {/* Tipo: esquina inferior izquierda */}
        {item.tipo && (
          <div className="absolute bottom-3 left-3 bg-primary/80 text-text-light px-2 py-1 rounded text-xs font-semibold">
            {item.tipo}
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentCarousel;