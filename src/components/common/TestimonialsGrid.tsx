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
  const theme = useTheme();

  useEffect(() => {
    fetchActiveTestimonials()
      .then(setTestimonials)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((item) => (
        <TestimonialCard key={item.id} item={item} theme={theme} />
      ))}
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