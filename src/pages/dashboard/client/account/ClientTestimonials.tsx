// roshi_fit/src/pages/dashboard/client/account/ClientTestimonials.tsx
import React, { useEffect, useState } from 'react';
import { fetchClientTestimonials, deactivateTestimonial } from '../../../../api/testimonialApi';
import type { ClientTestimonial } from '../../../../types/Testimonial';
import TestimonialFormModal from './TestimonialFormModal';
import { Edit3, EyeOff, Plus } from 'lucide-react';

const ClientTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<ClientTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<ClientTestimonial | null>(null);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const userData = localStorage.getItem('userData');
        if (!userData) return;
        
        const user = JSON.parse(userData);
        const data = await fetchClientTestimonials(user.id);
        setTestimonials(data);
      } catch (e) {
        setError('No se pudieron cargar tus testimonios');
      } finally {
        setLoading(false);
      }
    };
    loadTestimonials();
  }, []);

  const handleSuccess = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      fetchClientTestimonials(user.id).then(setTestimonials);
    }
  };

  const handleEdit = (testimonial: ClientTestimonial) => {
    setEditingTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleDeactivate = async (id: number) => {
    if (!confirm('¿Desactivar este testimonio?')) return;
    try {
      await deactivateTestimonial(id);
      handleSuccess();
    } catch (e) {
      alert('Error al desactivar testimonio');
    }
  };

  return (
    <div className="bg-dashboard-accent/30 p-6 rounded-xl border border-dashboard-accent">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dashboard-text">Mis Testimonios</h2>
        <button
          onClick={() => {
            setEditingTestimonial(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1 px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded hover:bg-dashboard-secondary transition-colors"
        >
          <Plus size={16} />
          Nuevo Testimonio
        </button>
      </div>

      {loading && <p className="text-dashboard-text">Cargando testimonios...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
          {testimonials.length === 0 ? (
            <p className="text-dashboard-text">No tienes testimonios aún. ¡Comparte tu experiencia!</p>
          ) : (
            testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-dashboard-accent/50 p-4 rounded-lg border border-dashboard-accent"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-dashboard-text mb-2">"{testimonial.testimonio}"</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={i < testimonial.rating ? 'text-gold' : 'text-gray-400'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="p-1 text-dashboard-text hover:text-dashboard-primary"
                      title="Editar"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeactivate(testimonial.id)}
                      className="p-1 text-dashboard-text hover:text-red-400"
                      title="Desactivar"
                    >
                      <EyeOff size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-dashboard-text-secondary">
                  Estado: {testimonial.estado === 'activo' ? '✅ Activo' : '⏸️ Inactivo'}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {isModalOpen && (
        <TestimonialFormModal
          userId={JSON.parse(localStorage.getItem('userData')!).id}
          testimonial={editingTestimonial || undefined}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTestimonial(null);
          }}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ClientTestimonials;