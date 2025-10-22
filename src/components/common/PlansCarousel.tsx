// roshi_fit/src/components/common/PlansCarousel.tsx
import React, { useState, useEffect } from 'react';
import { type Plan } from '../../types/Plan';
import { fetchActivePlans } from '../../api/planApi';

const PlansCarousel: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Cargar planes
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await fetchActivePlans();
        setPlans(data);
      } catch (err) {
        console.error('Error al cargar planes:', err);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  // Carrusel automático (solo si hay > 3)
  useEffect(() => {
    if (plans.length <= 3) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % plans.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [plans.length]);

  // Navegación manual
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % plans.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + plans.length) % plans.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-text-gray text-lg">Cargando planes...</p>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-text-gray text-lg">No hay planes disponibles en este momento.</p>
      </div>
    );
  }

  // Función para convertir precio seguro
  const formatPrice = (precio: string | number): number => {
    if (typeof precio === 'number') return precio;
    return parseFloat(precio) || 0;
  };

  // Render fijo si ≤ 3
  if (plans.length <= 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} formatPrice={formatPrice} />
        ))}
      </div>
    );
  }

  // Carrusel: 3 visibles
  const visiblePlans = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex + i) % plans.length;
    visiblePlans.push(plans[index]);
  }

  return (
    <div className="relative py-6">
      {/* Contenedor del carrusel */}
      <div className="relative overflow-hidden px-10">
        <div className="flex justify-center gap-8 transition-all duration-500 ease-out">
          {visiblePlans.map((plan, idx) => (
            <div 
              key={`${plan.id}-${idx}`} 
              className={`
                flex-shrink-0 w-full max-w-sm transform transition-all duration-300
                ${idx === 1 ? 'scale-105' : 'scale-100'}
              `}
            >
              <PlanCard plan={plan} formatPrice={formatPrice} />
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
        {plans.map((_, index) => (
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
const PlanCard: React.FC<{
  plan: Plan;
  formatPrice: (precio: string | number) => number;
}> = ({ plan, formatPrice }) => {
  const price = formatPrice(plan.precio_q);

  return (
    <div className="
      bg-gradient-to-br from-accent to-secondary 
      rounded-2xl overflow-hidden border-2 border-accent/50
      shadow-2xl hover:shadow-primary/20 transition-all duration-500
      hover:border-primary/30 hover:translate-y-1
      group bg-black
    ">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6 border-b border-accent/50">
        <h3 className="text-2xl font-bold text-text-light text-center group-hover:text-gold transition-colors duration-300">
          {plan.nombre}
        </h3>
        
        <p className="text-3xl font-extrabold text-gold text-center mt-4 bg-gold/10 px-4 py-3 rounded-xl border border-gold/20">
          Q{price.toFixed(2)}
        </p>
      </div>

      <div className="p-6">
        <p className="text-text-gray text-sm mb-6 leading-relaxed text-center">
          {plan.descripcion}
        </p>

        {/* Beneficios */}
        {plan.beneficios && (
          <ul className="mb-6 space-y-3">
            {Object.entries(plan.beneficios)
              .sort(([, a], [, b]) => (b ? 1 : 0) - (a ? 1 : 0))
              .map(([clave, valor]) => {
                const nombreBonito = clave
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase());

                // Icono mejorado según valor booleano
                const icono = valor ? (
                  <span className="text-success mr-3 text-lg">✓</span>
                ) : (
                  <span className="text-red-400 mr-3 text-lg">✗</span>
                );

                return (
                  <li 
                    key={clave} 
                    className={`
                      text-sm flex items-start transition-all duration-300
                      ${valor ? 'text-text-light' : 'text-text-gray'}
                      hover:translate-x-1
                    `}
                  >
                    {icono}
                    <span className={valor ? '' : 'line-through'}>{nombreBonito}</span>
                  </li>
                );
              })}
          </ul>
        )}

        {/* Botón mejorado */}
        <button className="
          w-full py-3 bg-primary/90 hover:bg-primary 
          text-text-light font-bold rounded-xl 
          transition-all duration-300 transform hover:scale-105
          shadow-lg hover:shadow-xl border border-primary/50
          hover:animate-pulse-gym
        ">
          Seleccionar Plan
        </button>
      </div>
    </div>
  );
};

export default PlansCarousel;