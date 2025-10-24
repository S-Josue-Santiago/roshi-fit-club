// roshi_fit/src/components/common/PlansCarousel.tsx
import React, { useState, useEffect } from 'react';
import { type Plan } from '../../types/Plan';
import { fetchActivePlans } from '../../api/planApi';

// Hook para detectar el tema actual
const useTheme = () => {
  const [theme, setTheme] = useState<'original' | 'futurista'>('original');

  useEffect(() => {
    const checkTheme = () => {
      const bodyClass = document.body.className;
      if (bodyClass.includes('futurista')) {
        setTheme('futurista');
      } else {
        setTheme('original');
      }
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return theme;
};

const PlansCarousel: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

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

  const getLoadingStyle = () => {
    return theme === 'futurista' 
      ? 'text-gray-600 text-lg font-light' 
      : 'text-gray-400 text-lg font-light';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <p className={getLoadingStyle()}>Cargando planes...</p>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-10">
        <p className={getLoadingStyle()}>No hay planes disponibles en este momento.</p>
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
          <PlanCard key={plan.id} plan={plan} formatPrice={formatPrice} theme={theme} />
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
              <PlanCard plan={plan} formatPrice={formatPrice} theme={theme} />
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
        {plans.map((_, index) => (
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

// Tarjeta individual con diseño mejorado
const PlanCard: React.FC<{
  plan: Plan;
  formatPrice: (precio: string | number) => number;
  theme: 'original' | 'futurista';
}> = ({ plan, formatPrice, theme }) => {
  const price = formatPrice(plan.precio_q);

  const getCardStyle = () => {
    if (theme === 'futurista') {
      return {
        container: 'rounded-2xl overflow-hidden transition-all duration-500 hover:translate-y-1 group',
        containerStyle: {
          background: 'linear-gradient(315deg, rgba(255, 255, 255, 0.9), rgba(240, 244, 248, 0.9))',
          boxShadow: '-12px -12px 24px rgba(255, 255, 255, 0.9), 12px 12px 24px rgba(0, 120, 255, 0.15)',
          border: '2px solid rgba(0, 120, 255, 0.2)'
        },
        header: 'p-6 border-b border-blue-200/50',
        title: 'text-2xl font-black text-gray-800 text-center',
        priceContainer: 'text-3xl font-extrabold text-blue-600 text-center mt-4 px-4 py-3 rounded-xl',
        priceContainerStyle: {
          background: 'linear-gradient(135deg, rgba(0, 120, 255, 0.05), rgba(0, 212, 255, 0.05))',
          border: '1px solid rgba(0, 120, 255, 0.15)'
        },
        description: 'text-gray-600 text-sm mb-6 leading-relaxed text-center',
        benefitItem: (valor: boolean) => `text-sm flex items-start transition-all duration-300 ${valor ? 'text-gray-700' : 'text-gray-400'}`,
        benefitIcon: (valor: boolean) => `mr-3 text-lg ${valor ? 'text-blue-500' : 'text-gray-400'}`,
        button: 'w-full py-3 font-black text-white rounded-xl transition-all duration-300 transform hover:scale-105',
        buttonStyle: {
          background: 'linear-gradient(135deg, #0078ff, #00d4ff)',
          boxShadow: '0 6px 20px rgba(0, 120, 255, 0.3)'
        }
      };
    }
    // Tema Original
    return {
      container: 'rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 group',
      containerStyle: {
        background: 'linear-gradient(315deg, rgba(30, 30, 30, 0.95), rgba(45, 45, 45, 0.95))',
        boxShadow: '-8px -8px 16px rgba(20, 20, 20, 0.8), 8px 8px 16px rgba(80, 80, 80, 0.3)',
        border: '1px solid rgba(255, 107, 53, 0.2)'
      },
      header: 'p-6 border-b border-accent/50',
      title: 'text-2xl font-black text-white text-center',
      priceContainer: 'text-3xl font-extrabold text-orange-400 text-center mt-4 px-3 py-1 rounded-lg inline-block',
      priceContainerStyle: {
        background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.15), rgba(255, 140, 66, 0.15))',
        border: '1px solid rgba(255, 107, 53, 0.3)'
      },
      description: 'text-text-gray text-sm mb-6 leading-relaxed text-center',
      benefitItem: (valor: boolean) => `text-sm flex items-start transition-all duration-300 ${valor ? 'text-text-light' : 'text-text-gray'} hover:translate-x-1`,
      benefitIcon: (valor: boolean) => `mr-3 text-lg ${valor ? 'text-success' : 'text-red-400'}`,
      button: 'w-full py-3 bg-primary/90 hover:bg-primary text-text-light font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-primary/50 hover:animate-pulse-gym',
      buttonStyle: {}
    };
  };

  const styles = getCardStyle();

  return (
    <div className={styles.container} style={styles.containerStyle}>
      {/* Header con gradiente */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          {plan.nombre}
        </h3>
        <div className="text-center mt-4">
          <p className={styles.priceContainer} style={styles.priceContainerStyle}>
            Q{price.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="p-6">
        <p className={styles.description}>
          {plan.descripcion}
        </p>

        {/* Beneficios */}
        {plan.beneficios && (
          <ul className="mb-6 space-y-3">
            {Object.entries(plan.beneficios)
              .sort(([, a], [, b]) => (a === b ? 0 : a ? -1 : 1)) // Activos primero
              .map(([clave, valor]) => {
                const nombreBonito = clave
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase());

                const icono = valor ? '✓' : '✗';

                return (
                  <li key={clave} className={styles.benefitItem(valor)}>
                    <span className={styles.benefitIcon(valor)}>{icono}</span>
                    <span className={valor ? '' : 'line-through'}>{nombreBonito}</span>
                  </li>
                );
              })}
          </ul>
        )}

        {/* Botón mejorado */}
        <button className={styles.button} style={styles.buttonStyle}>
          Seleccionar Plan
        </button>
      </div>
    </div>
  );
};

export default PlansCarousel;