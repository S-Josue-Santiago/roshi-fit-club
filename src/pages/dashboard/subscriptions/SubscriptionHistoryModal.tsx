// roshi_fit/src/pages/dashboard/subscriptions/SubscriptionHistoryModal.tsx
import React, { useEffect, useState } from 'react';
import { fetchSubscriptionHistory } from '../../../api/subscriptionApi';
import { X, History, Award, Calendar, Activity } from 'lucide-react';

interface Props {
  usuarioId: number;
  onClose: () => void;
}

const SubscriptionHistoryModal: React.FC<Props> = ({ usuarioId, onClose }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchSubscriptionHistory(usuarioId);
        setItems(data);
      } catch (e) {
        setError('No se pudo cargar el historial');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [usuarioId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-white" onClick={onClose}>
      <div className="bg-black p-6 rounded-2xl shadow-2xl w-full max-w-3xl border-2 border-dashboard-accent/50 max-h-[90vh] overflow-y-auto" onClick={(e)=>e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-600/20 rounded-lg">
              <History size={24} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">HISTORIAL DE SUSCRIPCIONES</h2>
          </div>
          <button onClick={onClose} className="p-2 text-dashboard-text hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 transform hover:scale-110">
            <X size={24} />
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-dashboard-primary"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-600/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto mt-6">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden border border-dashboard-accent/50 rounded-lg bg-dashboard-accent/10">
                <table className="min-w-full divide-y divide-dashboard-accent/30">
                  <thead className="bg-dashboard-accent/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-dashboard-text uppercase tracking-wider"><div className="flex items-center gap-2"><Award size={16} />Plan</div></th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-dashboard-text uppercase tracking-wider"><div className="flex items-center gap-2"><Calendar size={16} />Inicio</div></th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-dashboard-text uppercase tracking-wider"><div className="flex items-center gap-2"><Calendar size={16} />Fin</div></th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-dashboard-text uppercase tracking-wider"><div className="flex items-center gap-2"><Activity size={16} />Estado</div></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashboard-accent/20 text-dashboard-text">
                    {items.map((s, idx) => (
                      <tr key={idx} className="hover:bg-dashboard-accent/20">
                        <td className="px-4 py-3 text-sm font-semibold">{s.planes_suscripcion?.nombre || '-'}</td>
                        <td className="px-4 py-3 text-sm">{new Date(s.fecha_inicio).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm">{new Date(s.fecha_fin).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm capitalize">{s.estado_suscripcion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionHistoryModal;
