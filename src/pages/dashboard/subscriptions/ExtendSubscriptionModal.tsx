// roshi_fit/src/pages/dashboard/subscriptions/ExtendSubscriptionModal.tsx
import React, { useState } from 'react';

interface ExtendSubscriptionModalProps {
  subscriptionId: number;
  onClose: () => void;
  onExtend: (id: number, dias: number) => void;
}

const ExtendSubscriptionModal: React.FC<ExtendSubscriptionModalProps> = ({ subscriptionId, onClose, onExtend }) => {
  const [dias, setDias] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const diasNum = parseInt(dias);
    if (isNaN(diasNum) || diasNum <= 0) {
      setError('Ingrese un número válido de días.');
      setLoading(false);
      return;
    }

    onExtend(subscriptionId, diasNum);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div
        className="bg-dashboard-accent/90 p-6 rounded-xl shadow-2xl w-full max-w-md border border-dashboard-accent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-dashboard-accent pb-2">
          <h2 className="text-xl font-bold text-dashboard-text">Extender Suscripción</h2>
          <button onClick={onClose} className="text-dashboard-text hover:text-dashboard-primary text-2xl">
            &times;
          </button>
        </div>

        {error && <div className="bg-red-800/50 text-red-200 p-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-dashboard-text-secondary mb-1">
              Días a agregar
            </label>
            <input
              type="number"
              min="1"
              value={dias}
              onChange={(e) => setDias(e.target.value)}
              required
              className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-dashboard-text hover:text-dashboard-primary">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded hover:bg-dashboard-secondary transition-colors"
            >
              {loading ? 'Extendiendo...' : 'Extender'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExtendSubscriptionModal;