// roshi_fit/src/pages/dashboard/client/account/ClientTestimonials.tsx
import React, { useEffect, useState } from 'react';
import { fetchClientTestimonials, toggleTestimonialStatus } from '../../../../api/testimonialApi';
import type { ClientTestimonial } from '../../../../types/Testimonial';
import TestimonialFormModal from './TestimonialFormModal';
import { Edit3, EyeOff, Plus, Eye, MessageSquare, Star } from 'lucide-react';

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

  const handleToggleStatus = async (testimonial: ClientTestimonial) => {
    const isActivating = testimonial.estado !== 'activo';
    const actionText = isActivating ? 'activar' : 'desactivar';

    try {
      await toggleTestimonialStatus(testimonial.id);
      handleSuccess(); // Recargar la lista de testimonios
    } catch (e) {
      console.error(`Error al ${actionText} el testimonio:`, e);
      alert(`Error al ${actionText} el testimonio.`);
    }
  };

  return (
    <div className="bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="p-2 bg-cyan-600/20 rounded-lg">
            <MessageSquare size={24} className="text-cyan-400" />
          </div>
          <h1 className="text-2xl font-black text-dashboard-text">MIS TESTIMONIOS</h1>
        </div>
        <button
          onClick={() => {
            setEditingTestimonial(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <Plus size={18} />
          Nuevo Testimonio
        </button>
      </div>

      {loading && <p className="text-dashboard-text">Cargando testimonios...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
          {testimonials.length > 0 ? (
            testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-dashboard-accent/50 p-4 rounded-lg border border-dashboard-accent/50 transition-all duration-300 hover:border-cyan-400/50 hover:bg-dashboard-accent/80"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-dashboard-text italic mb-3">"{testimonial.testimonio}"</p>
                    <div className="flex items-center gap-4 text-xs text-dashboard-text-secondary">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-gold" />
                        <span className="font-bold">{testimonial.rating} de 5 estrellas</span>
                      </div>
                      <div className={`flex items-center gap-1 font-bold ${testimonial.estado === 'activo' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {testimonial.estado === 'activo' ? '✅' : '⏸️'}
                        <span>{testimonial.estado === 'activo' ? 'Visible públicamente' : 'Inactivo'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 transition-colors"
                      title="Editar"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(testimonial)}
                      className={`p-2 rounded-lg transition-colors ${
                        testimonial.estado === 'activo' 
                          ? 'bg-red-600/20 text-red-400 hover:bg-red-600/40' 
                          : 'bg-green-600/20 text-green-400 hover:bg-green-600/40'
                      }`}
                      title={testimonial.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    >
                      {testimonial.estado === 'activo' ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50">
              <div className="text-5xl mb-4">🗣️</div>
              <p className="text-dashboard-text text-lg font-bold">Aún no has compartido tu experiencia.</p>
              <p className="text-dashboard-text-secondary mt-1">¡Crea tu primer testimonio y ayuda a otros guerreros!</p>
            </div>
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