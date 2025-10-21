// roshi_fit/src/components/common/TestimonialsGrid.tsx
import React, { useState, useEffect } from 'react';
import { fetchActiveTestimonials } from '../../api/testimonialApi';
import { type Testimonial } from '../../types/Testimonial';

const TestimonialsGrid: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveTestimonials()
      .then(setTestimonials)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-text-gray text-center py-6">Cargando testimonios...</p>;
  }

  if (testimonials.length === 0) {
    return <p className="text-text-gray text-center py-6">No hay testimonios disponibles.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((item) => (
        <TestimonialCard key={item.id} item={item} />
      ))}
    </div>
  );
};

// Renderiza estrellas según el rating (1-5)
const StarRating: React.FC<{ rating: number | null }> = ({ rating }) => {
  if (!rating || rating < 1) return null;

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? 'text-gold' : 'text-text-gray/30'}>
        ⭐
      </span>
    );
  }
  return <div className="flex">{stars}</div>;
};

// Tarjeta individual
const TestimonialCard: React.FC<{ item: Testimonial }> = ({ item }) => {
  return (
    <div className="bg-accent/50 rounded-xl p-6 border border-accent shadow-lg">
      {/* Testimonio */}
      <p className="text-text-light italic mb-6">“{item.testimonio}”</p>

      {/* Avatar + Nombre + Rating */}
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        {item.avatar ? (
          <img
            src={`../../../public/assets/testimonials/${item.avatar}`}
            alt={item.nombre_mostrar || 'Usuario'}
            className="w-12 h-12 rounded-full object-cover border-2 border-accent"
            onError={(e) => (e.currentTarget.src = '/assets/avatar_default.jpg')}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-text-light font-bold">
            {item.nombre_mostrar?.charAt(0) || '?'}
          </div>
        )}

        {/* Nombre + Rating */}
        <div className="flex-1">
          <p className="font-bold text-text-light">{item.nombre_mostrar || 'Anónimo'}</p>
          <StarRating rating={item.rating} />
        </div>
      </div>
    </div>
  );
};

export default TestimonialsGrid;