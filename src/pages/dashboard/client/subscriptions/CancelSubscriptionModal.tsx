// roshi_fit/src/pages/dashboard/client/subscriptions/CancelSubscriptionModal.tsx
import React, { useState } from 'react';
import { cancelSubscription } from '../../../../api/subscriptionApi';
import { X, AlertTriangle } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-white" onClick={onClose}>
      <div
        className="bg-black p-6 rounded-2xl shadow-2xl w-full max-w-md border-2 border-dashboard-accent/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600/20 rounded-lg">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">CANCELAR SUSCRIPCIÓN</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-dashboard-text hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 transform hover:scale-110"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-600/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-dashboard-text-secondary text-center text-base">
            ¿Estás seguro de que deseas cancelar tu suscripción? Esta acción no se puede deshacer.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-dashboard-accent/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-dashboard-text font-bold border-2 border-dashboard-accent/50 rounded-xl hover:border-gray-400 hover:text-gray-300 hover:bg-gray-400/10 transition-all"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-red-800/80 text-white font-bold rounded-xl hover:bg-red-700 disabled:from-gray-600 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Confirmar Cancelación'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;