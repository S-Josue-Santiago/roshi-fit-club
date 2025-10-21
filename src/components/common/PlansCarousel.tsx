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
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [plans.length]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-text-gray">Cargando planes...</p>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-text-gray">No hay planes disponibles en este momento.</p>
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
    <div className="relative overflow-hidden">
      <div className="flex justify-center gap-8 transition-transform duration-500 ease-in-out">
        {visiblePlans.map((plan, idx) => (
          <div key={`${plan.id}-${idx}`} className="flex-shrink-0 w-full max-w-xs">
            <PlanCard plan={plan} formatPrice={formatPrice} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Tarjeta individual
const PlanCard: React.FC<{
  plan: Plan;
  formatPrice: (precio: string | number) => number;
}> = ({ plan, formatPrice }) => {
  const price = formatPrice(plan.precio_q);

  return (
    <div className="bg-accent/50 rounded-xl overflow-hidden border border-accent shadow-lg hover:shadow-xl transition-shadow">
      {/* {plan.imagen ? (
        <img
          src={`/assets/plans/${plan.imagen}`}
          alt={plan.nombre}
          className="w-full h-40 object-cover"
          onError={(e) => (e.currentTarget.src = '/assets/placeholder.jpg')}
        />
      ) : (
        <div className="w-full h-40 bg-secondary flex items-center justify-center text-text-gray">
          Sin imagen
        </div>
      )} */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-text-light mb-2">{plan.nombre}</h3>

        <p className="text-2xl font-extrabold text-gold mb-4">Q{price.toFixed(2)}</p>

        <p className="text-text-gray text-sm mb-3">{plan.descripcion}</p>

        {/* Beneficios: muestra todos (true y false) */}
        {plan.beneficios && (
                <ul className="mb-4 space-y-1">
                    {Object.entries(plan.beneficios)
                    .sort(([, a], [, b]) => (b ? 1 : 0) - (a ? 1 : 0))
                    .map(([clave, valor]) => {
                    const nombreBonito = clave
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, l => l.toUpperCase());

                    // Icono según valor booleano
                    const icono = valor ? (
                        <span className="text-gold mr-2">✓</span>
                    ) : (
                        <span className="text-red-400 mr-2">✗</span>
                    );

                    return (
                        <li key={clave} className="text-sm text-text-light/90 flex items-start">
                        {icono}
                        {nombreBonito}
                        </li>
                    );
                    })}
                </ul>
                )}

        {/* Precio destacado */}        
        

        {/* Botón */}
        <button className="w-full py-2 bg-primary text-text-light font-semibold rounded-lg hover:bg-gold transition-colors">
          Seleccionar Plan
        </button>
      </div>
    </div>
  );
};

export default PlansCarousel;