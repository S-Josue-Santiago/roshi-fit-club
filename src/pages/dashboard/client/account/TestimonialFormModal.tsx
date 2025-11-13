// roshi_fit/src/pages/dashboard/client/account/TestimonialFormModal.tsx
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import type { ClientTestimonial } from '../../../../types/Testimonial';
import { createTestimonial, updateTestimonial } from '../../../../api/testimonialApi';

interface TestimonialFormModalProps {
  userId: number;
  testimonial?: ClientTestimonial;
  onClose: () => void;
  onSuccess: () => void;
}

const TestimonialFormModal: React.FC<TestimonialFormModalProps> = ({
  userId,
  testimonial,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    testimonio: testimonial?.testimonio || '',
    rating: testimonial?.rating || 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, testimonio: e.target.value });
  };

  const handleRatingChange = (value: number) => {
    setFormData({ ...formData, rating: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (testimonial) {
        await updateTestimonial(testimonial.id, formData);
      } else {
        await createTestimonial({ ...formData, usuario_id: userId });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al guardar testimonio.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-dashboard-accent/90 p-6 rounded-xl shadow-2xl w-full max-w-md border border-dashboard-accent" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 border-b border-dashboard-accent pb-2">
          <h2 className="text-xl font-bold text-dashboard-text">
            {testimonial ? 'Editar Testimonio' : 'Nuevo Testimonio'}
          </h2>
          <button onClick={onClose} className="text-dashboard-text hover:text-dashboard-primary text-2xl">
            &times;
          </button>
        </div>

        {error && <div className="bg-red-800/50 text-red-200 p-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Testimonio */}
          <div>
            <label className="block text-sm text-dashboard-text-secondary mb-1">Testimonio</label>
            <textarea
              value={formData.testimonio}
              onChange={handleChange}
              required
              minLength={10}
              maxLength={500}
              className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
              rows={4}
              placeholder="Comparte tu experiencia con Roshi Fit..."
            />
            <p className="text-xs text-dashboard-text-secondary mt-1">
              {formData.testimonio.length}/500 caracteres
            </p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm text-dashboard-text-secondary mb-2">Calificación</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="text-2xl"
                  aria-label={`Calificar con ${star} estrellas`}
                >
                  {star <= formData.rating ? (
                    <Star className="text-gold" fill="currentColor" />
                  ) : (
                    <Star className="text-dashboard-text-secondary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-dashboard-text hover:text-dashboard-primary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded hover:bg-dashboard-secondary transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialFormModal;