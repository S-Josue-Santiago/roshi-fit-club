// roshi_fit/src/pages/dashboard/client/subscriptions/CancelSubscriptionModal.tsx
import React, { useState } from 'react';
import { cancelSubscription } from '../../../../api/subscriptionApi';

interface Props {
  subscriptionId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const CancelSubscriptionModal: React.FC<Props> = ({ subscriptionId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await cancelSubscription(subscriptionId);
      onSuccess();
    } catch (e) {
      setError('Error al cancelar la suscripción.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-dashboard-accent/90 p-6 rounded-xl shadow-2xl w-full max-w-md border border-dashboard-accent" onClick={(e)=>e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 border-b border-dashboard-accent pb-2">
          <h2 className="text-xl font-bold text-dashboard-text">Cancelar Suscripción</h2>
          <button onClick={onClose} className="text-dashboard-text hover:text-dashboard-primary text-2xl">&times;</button>
        </div>

        {error && <div className="bg-red-800/50 text-red-200 p-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-dashboard-text">
            ¿Estás seguro de que deseas cancelar tu suscripción? Esta acción no se puede deshacer.
          </p>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-dashboard-text hover:text-dashboard-primary">
              Volver
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-500 transition-colors"
            >
              {loading ? 'Cancelando...' : 'Confirmar Cancelación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;