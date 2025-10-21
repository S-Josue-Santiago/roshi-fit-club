// roshi_fit/src/pages/dashboard/subscriptions/SubscriptionHistoryModal.tsx
import React, { useEffect, useState } from 'react';
import { fetchSubscriptionHistory } from '../../../api/subscriptionApi';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-dashboard-accent/90 p-6 rounded-xl shadow-2xl w-full max-w-3xl border border-dashboard-accent" onClick={(e)=>e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 border-b border-dashboard-accent pb-2">
          <h2 className="text-xl font-bold text-dashboard-text">Historial de Suscripciones</h2>
          <button onClick={onClose} className="text-dashboard-text hover:text-dashboard-primary text-2xl">&times;</button>
        </div>

        {loading && <div className="text-dashboard-text">Cargando...</div>}
        {error && <div className="bg-red-800/50 text-red-200 p-2 rounded mb-4">{error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-dashboard-text-secondary border-b border-dashboard-accent">
                  <th className="py-2">Plan</th>
                  <th className="py-2">Inicio</th>
                  <th className="py-2">Fin</th>
                  <th className="py-2">Estado</th>
                </tr>
              </thead>
              <tbody className="text-dashboard-text">
                {items.map((s, idx) => (
                  <tr key={idx} className="border-b border-dashboard-accent/40">
                    <td className="py-2">{s.planes_suscripcion?.nombre || '-'}</td>
                    <td className="py-2">{new Date(s.fecha_inicio).toLocaleDateString()}</td>
                    <td className="py-2">{new Date(s.fecha_fin).toLocaleDateString()}</td>
                    <td className="py-2 capitalize">{s.estado_suscripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionHistoryModal;
