// roshi_fit/src/pages/dashboard/subscriptions/SubscriptionsList.tsx
import React, { useEffect, useState } from 'react'; // useMemo
import type { Plan } from '../../../types/Plan';
import type { SubscriptionWithUserPlan } from '../../../types/Subscription';
import api from '../../../api/axiosInstance';
import { cancelSubscription, extendSubscription, fetchSubscriptions } from '../../../api/subscriptionApi';
import SubscriptionsFilters from './SubscriptionsFilters';
import SubscriptionActions from './SubscriptionActions';
import ExtendSubscriptionModal from './ExtendSubscriptionModal';
import RenewSubscriptionModal from './RenewSubscriptionModal';
import SubscriptionHistoryModal from './SubscriptionHistoryModal';

const SubscriptionsList: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [items, setItems] = useState<SubscriptionWithUserPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({ search: '', planId: '', estado: '' as any, orderDays: '' as any });

  const [extendId, setExtendId] = useState<number | null>(null);
  const [renewUserId, setRenewUserId] = useState<number | null>(null);
  const [historyUserId, setHistoryUserId] = useState<number | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const [p, s] = await Promise.all([
        api.get<Plan[]>('/plans/for-registration').then(r=>r.data),
        fetchSubscriptions({
          search: filters.search || undefined,
          planId: filters.planId || undefined,
          estado: filters.estado || undefined,
          orderDays: filters.orderDays || undefined,
        })
      ]);
      setPlans(p);
      setItems(s as any);
    } catch (e) {
      setError('No se pudo cargar la información.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filters.search, filters.planId, filters.estado, filters.orderDays]);

  const handleExtend = async (id: number, dias: number) => {
    try {
      await extendSubscription(id, dias);
      setExtendId(null);
      await load();
    } catch (e) {
      alert('Error al extender suscripción');
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('¿Cancelar esta suscripción?')) return;
    try {
      await cancelSubscription(id);
      await load();
    } catch (e) {
      alert('Error al cancelar suscripción');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-dashboard-text mb-4">Suscripciones de Usuarios</h1>

      <SubscriptionsFilters plans={plans} values={filters} onChange={setFilters} />

      {loading && <div className="text-dashboard-text">Cargando...</div>}
      {error && <div className="bg-red-800/50 text-red-200 p-2 rounded mb-4">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-dashboard-text-secondary border-b border-dashboard-accent">
                <th className="py-2">Usuario</th>
                <th className="py-2">Teléfono</th>
                <th className="py-2">Plan</th>
                <th className="py-2">Fecha Inicio</th>
                <th className="py-2">Fecha Fin</th>
                <th className="py-2">Días Restantes</th>
                <th className="py-2">Estado</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-dashboard-text">
              {items.map((s) => (
                <tr key={s.id} className="border-b border-dashboard-accent/40">
                  <td className="py-2">
                    <div className="font-semibold">{s.usuario?.nombre_completo}</div>
                    <div className="text-xs text-dashboard-text-secondary">{s.usuario?.email}</div>
                  </td>
                  <td className="py-2">{s.usuario?.telefono || '-'}</td>
                  <td className="py-2">{s.plan?.nombre}</td>
                  <td className="py-2">{new Date(s.fecha_inicio).toLocaleDateString()}</td>
                  <td className="py-2">{new Date(s.fecha_fin).toLocaleDateString()}</td>
                  <td className="py-2">{s.dias_restantes}</td>
                  <td className="py-2 capitalize">{s.computed_estado}</td>
                  <td className="py-2">
                    <SubscriptionActions
                      onExtend={() => setExtendId(s.id)}
                      onCancel={() => handleCancel(s.id)}
                      onRenew={() => setRenewUserId(s.usuario_id)}
                      onHistory={() => setHistoryUserId(s.usuario_id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {extendId !== null && (
        <ExtendSubscriptionModal
          subscriptionId={extendId}
          onClose={() => setExtendId(null)}
          onExtend={handleExtend}
        />
      )}

      {renewUserId !== null && (
        <RenewSubscriptionModal
          usuarioId={renewUserId}
          onClose={() => setRenewUserId(null)}
          onSuccess={load}
        />
      )}

      {historyUserId !== null && (
        <SubscriptionHistoryModal
          usuarioId={historyUserId}
          onClose={() => setHistoryUserId(null)}
        />
      )}
    </div>
  );
};

export default SubscriptionsList;
