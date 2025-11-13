// roshi_fit/src/components/common/TestimonialsGrid.tsx
import React, { useState, useEffect } from 'react';
import { fetchActiveTestimonials } from '../../api/testimonialApi';
import { type Testimonial } from '../../types/Testimonial';

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

const TestimonialsGrid: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    fetchActiveTestimonials()
      .then(setTestimonials)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Carrusel automático
  useEffect(() => {
    // Solo activar el carrusel automático si hay más de 3 testimonios
    if (testimonials.length > 3) {
      const timer = setInterval(() => {
        // Llama a la función para pasar a la siguiente diapositiva
        nextSlide();
      }, 3000); // Cambia cada 3 segundos

      return () => clearInterval(timer); // Limpia el temporizador si el componente se desmonta
    }
  }, [testimonials.length]); // Se ejecuta cuando la cantidad de testimonios cambia

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getLoadingStyle = () => {
    return theme === 'futurista'
      ? 'text-gray-600 text-lg font-light'
      : 'text-gray-400 text-lg font-light';
  };

  if (loading) {
    return <p className={`${getLoadingStyle()} text-center py-10`}>Cargando testimonios...</p>;
  }

  if (testimonials.length === 0) {
    return <p className={`${getLoadingStyle()} text-center py-10`}>No hay testimonios disponibles.</p>;
  }

  // Mostrar todos si ≤ 3
  if (testimonials.length <= 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((item) => (
          <TestimonialCard key={item.id} item={item} theme={theme} />
        ))}
      </div>
    );
  }

  // Carrusel: 3 visibles
  const visibleTestimonials = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex + i) % testimonials.length;
    visibleTestimonials.push(testimonials[index]);
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
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={getButtonStyle()}
        aria-label="Anterior"
      >
        <span className="text-xl font-bold">‹</span>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={getButtonStyle()}
        aria-label="Siguiente"
      >
        <span className="text-xl font-bold">›</span>
      </button>

      {/* Carrusel */}
      <div className="flex justify-center gap-8 overflow-hidden px-10">
        {visibleTestimonials.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className={`flex-shrink-0 w-full max-w-sm transform transition-all duration-300 ${idx === 1 ? 'scale-105' : 'scale-100'}`}>
            <TestimonialCard item={item} theme={theme} />
          </div>
        ))}
      </div>

      {/* Indicadores de posición */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button key={index} onClick={() => setCurrentIndex(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${getIndicatorStyle(index === currentIndex)}`} />
        ))}
      </div>
    </div>
  );
};

// Renderiza estrellas según el rating (1-5)
const StarRating: React.FC<{ rating: number | null; theme: 'original' | 'futurista' }> = ({ rating, theme }) => {
  if (!rating || rating < 1) return null;

  const starColor = theme === 'futurista' ? 'text-blue-500' : 'text-gold';
  const emptyStarColor = theme === 'futurista' ? 'text-gray-300' : 'text-text-gray/30';

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? starColor : emptyStarColor}>
        ⭐
      </span>
    );
  }
  return <div className="flex">{stars}</div>;
};

// Tarjeta individual
const TestimonialCard: React.FC<{ item: Testimonial; theme: 'original' | 'futurista' }> = ({ item, theme }) => {
  const getCardStyle = () => {
    if (theme === 'futurista') {
      return {
        container: 'p-6 rounded-2xl transition-all duration-300',
        containerStyle: {
          background: 'linear-gradient(315deg, #f0f4f8, #ffffff)',
          boxShadow: '-8px -8px 16px rgba(255, 255, 255, 0.8), 8px 8px 16px rgba(0, 120, 255, 0.15)',
          border: '2px solid rgba(0, 120, 255, 0.2)'
        },
        testimonialText: 'italic mb-6 text-gray-700',
        avatar: 'w-12 h-12 rounded-full object-cover',
        avatarBorder: 'border-2 border-blue-200/50',
        avatarPlaceholder: 'w-12 h-12 rounded-full flex items-center justify-center font-bold text-white',
        avatarPlaceholderStyle: {
          background: 'linear-gradient(135deg, #0078ff, #00d4ff)'
        },
        name: 'font-bold text-gray-800'
      };
    }
    // Tema Original
    return {
      container: 'p-6 rounded-2xl transition-all duration-300',
      containerStyle: {
        background: 'linear-gradient(315deg, rgba(30, 30, 30, 0.95), rgba(45, 45, 45, 0.95))',
        boxShadow: '-8px -8px 16px rgba(20, 20, 20, 0.8), 8px 8px 16px rgba(80, 80, 80, 0.3)',
        border: '1px solid rgba(255, 107, 53, 0.2)'
      },
      testimonialText: 'text-text-light italic mb-6',
      avatar: 'w-12 h-12 rounded-full object-cover',
      avatarBorder: 'border-2 border-accent',
      avatarPlaceholder: 'w-12 h-12 rounded-full bg-primary flex items-center justify-center text-text-light font-bold',
      avatarPlaceholderStyle: {},
      name: 'font-bold text-text-light'
    };
  };

  const styles = getCardStyle();

  return (
    <div className={styles.container} style={styles.containerStyle}>
      {/* Testimonio */}
      <p className={styles.testimonialText}>“{item.testimonio}”</p>

      {/* Avatar + Nombre + Rating */}
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        {item.avatar ? (
          <img
            src={`/assets/testimonials/${item.avatar}`}
            alt={item.nombre_mostrar || 'Usuario'}
            className={`${styles.avatar} ${styles.avatarBorder}`}
            onError={(e) => (e.currentTarget.src = '/assets/avatartest.png')}
          />
        ) : (
          <div className={styles.avatarPlaceholder} style={styles.avatarPlaceholderStyle}>
            {item.nombre_mostrar?.charAt(0) || '?'}
          </div>
        )}

        {/* Nombre + Rating */}
        <div className="flex-1">
          <p className={styles.name}>{item.nombre_mostrar || 'Anónimo'}</p>
          <StarRating rating={item.rating} theme={theme} />
        </div>
      </div>
    </div>
  );
};

export default TestimonialsGrid;