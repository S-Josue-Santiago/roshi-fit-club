// roshi_fit/src/pages/dashboard/subscriptions/ExtendSubscriptionModal.tsx
import React, { useState } from 'react';
import { X, Save, PlusCircle, Calendar } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-white">
      <div
        className="bg-black p-6 rounded-2xl shadow-2xl w-full max-w-md border-2 border-dashboard-accent/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <PlusCircle size={24} className="text-blue-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">EXTENDER SUSCRIPCIÓN</h2>
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
          <div>
            <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><Calendar size={16} className="text-blue-400" />DÍAS A AGREGAR *</label>
            <input
              type="number"
              min="1"
              value={dias}
              onChange={(e) => setDias(e.target.value)}
              required
              className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Ej. 30"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-dashboard-accent/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-dashboard-text font-bold border-2 border-dashboard-accent/50 rounded-xl hover:border-red-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  EXTENDIENDO...
                </>
              ) : (
                <>
                  <Save size={18} />
                  EXTENDER
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExtendSubscriptionModal;