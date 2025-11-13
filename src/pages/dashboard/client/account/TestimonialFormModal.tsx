// roshi_fit/src/pages/dashboard/client/account/TestimonialFormModal.tsx
import React, { useState, useEffect } from 'react';
import { Star, X, Save, MessageSquare } from 'lucide-react';
import type { ClientTestimonial } from '../../../../types/Testimonial';
import { createTestimonial, updateTestimonial } from '../../../../api/testimonialApi';

interface TestimonialFormModalProps {
  userId: number;
  testimonial?: ClientTestimonial;
  onClose: () => void;
  onSuccess: () => void;
}

// Hook para detectar el tema del dashboard
const useDashboardThemeDetection = () => {
  const [detectedTheme, setDetectedTheme] = useState<'nocturno' | 'amanecer'>('nocturno');

  useEffect(() => {
    const checkTheme = () => {
      const bodyClass = document.body.className;
      setDetectedTheme(bodyClass.includes('theme-dashboard-amanecer') ? 'amanecer' : 'nocturno');
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return detectedTheme;
};

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
  const theme = useDashboardThemeDetection();

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

  const getStyles = () => {
    if (theme === 'amanecer') {
      return {
        overlay: 'bg-black/40',
        modal: 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-300',
        modalShadow: '0 25px 50px rgba(74, 144, 226, 0.25)',
        header: 'border-slate-300',
        headerIcon: 'bg-blue-100 text-blue-600',
        headerTitle: 'text-gray-900',
        closeButton: 'text-gray-600 hover:text-red-600 hover:bg-red-50',
        label: 'text-gray-700',
        textarea: 'bg-white text-gray-900 border-slate-300 focus:border-blue-500',
        charCount: 'text-gray-500',
        starButton: 'text-gray-400',
        starActive: 'text-yellow-400',
        cancelButton: 'bg-white border-slate-300 text-gray-700 hover:bg-slate-100',
        submitButton: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700',
        submitButtonShadow: '0 8px 20px rgba(74, 144, 226, 0.4)',
        errorContainer: 'bg-red-50 border-red-300 text-red-700'
      };
    }
    // Tema Nocturno
    return {
      overlay: 'bg-black/60',
      modal: 'bg-gradient-to-br from-[#0A0E27] via-[#16213E] to-[#0A0E27] border-purple-500/30',
      modalShadow: '0 25px 50px rgba(138, 43, 226, 0.3)',
      header: 'border-purple-500/30',
      headerIcon: 'bg-cyan-600/20 text-cyan-400',
      headerTitle: 'text-white',
      closeButton: 'text-white hover:text-red-400 hover:bg-red-500/20',
      label: 'text-white',
      textarea: 'bg-[#0A0E27] text-white border-purple-500/30 focus:border-cyan-500',
      charCount: 'text-gray-400',
      starButton: 'text-gray-500',
      starActive: 'text-gold',
      cancelButton: 'bg-[#16213E] border-purple-500/30 text-white hover:bg-[#1A1A2E]',
      submitButton: 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white hover:from-cyan-700 hover:to-cyan-800',
      submitButtonShadow: '0 8px 20px rgba(0, 255, 255, 0.3)',
      errorContainer: 'bg-red-900/20 border-red-500/40 text-red-300'
    };
  };

  const styles = getStyles();

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${styles.overlay} backdrop-blur-md`} onClick={onClose}>
      <div 
        className={`${styles.modal} p-6 md:p-8 rounded-3xl w-full max-w-lg border-2 animate-slideUp`}
        style={{ boxShadow: styles.modalShadow }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex justify-between items-center mb-6 pb-4 border-b-2 ${styles.header}`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${styles.headerIcon}`}>
              <MessageSquare size={24} />
            </div>
            <div>
              <h2 className={`text-2xl font-black ${styles.headerTitle}`}>
                {testimonial ? 'Editar Testimonio' : 'Nuevo Testimonio'}
              </h2>
              <p className={`text-xs ${theme === 'amanecer' ? 'text-gray-600' : 'text-[#B0BEC5]'} mt-0.5`}>
                Comparte tu experiencia con la comunidad
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-90 ${styles.closeButton}`}
          >
            <X size={24} />
          </button>
        </div>

        {error && <div className={`flex items-start gap-3 p-4 rounded-2xl border-2 ${styles.errorContainer} mb-4`}>{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Testimonio */}
          <div>
            <label className={`block text-sm font-bold mb-2 ${styles.label}`}>Tu experiencia</label>
            <textarea
              value={formData.testimonio}
              onChange={handleChange}
              required
              minLength={10}
              maxLength={500}
              className={`w-full p-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 ${styles.textarea}`}
              rows={4}
              placeholder="Comparte tu experiencia con Roshi Fit..."
            />
            <p className={`text-xs text-right mt-1 ${styles.charCount}`}>
              {formData.testimonio.length}/500 caracteres
            </p>
          </div>

          {/* Rating */}
          <div>
            <label className={`block text-sm font-bold mb-2 ${styles.label}`}>Tu calificación</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="text-3xl transition-transform duration-200 hover:scale-125"
                  aria-label={`Calificar con ${star} estrellas`}
                >
                  <Star 
                    className={star <= formData.rating ? styles.starActive : styles.starButton} 
                    fill={star <= formData.rating ? 'currentColor' : 'none'} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-3 rounded-xl font-bold border-2 transition-all duration-300 transform hover:scale-105 ${styles.cancelButton}`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-xl font-black border-2 border-transparent transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${styles.submitButton}`}
              style={{ boxShadow: styles.submitButtonShadow }}
            >
              {loading ? 'Guardando...' : (
                <span className="flex items-center justify-center gap-2">
                  <Save size={18} />
                  Guardar
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default TestimonialFormModal;