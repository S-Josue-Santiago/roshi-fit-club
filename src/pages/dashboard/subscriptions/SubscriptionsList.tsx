// roshi_fit/src/pages/dashboard/subscriptions/SubscriptionsList.tsx
import React, { useEffect, useState } from 'react';
import type { Plan } from '../../../types/Plan';
import type { SubscriptionWithUserPlan } from '../../../types/Subscription';
import api from '../../../api/axiosInstance';
import { cancelSubscription, extendSubscription, fetchSubscriptions } from '../../../api/subscriptionApi';
import SubscriptionsFilters from './SubscriptionsFilters';
import SubscriptionActions from './SubscriptionActions';
import ExtendSubscriptionModal from './ExtendSubscriptionModal';
import RenewSubscriptionModal from './RenewSubscriptionModal';
import SubscriptionHistoryModal from './SubscriptionHistoryModal';
import { Users, Calendar, Clock, AlertCircle } from 'lucide-react';

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

  const getStatusColor = (estado: string) => {
    const statusMap: Record<string, string> = {
      activa: 'bg-green-500/20 text-green-400 border-green-500/30',
      por_vencer: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      vencida: 'bg-red-500/20 text-red-400 border-red-500/30',
      cancelada: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return statusMap[estado] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getDaysColor = (dias: number) => {
    if (dias <= 0) return 'text-red-400 font-black';
    if (dias <= 3) return 'text-yellow-400 font-bold';
    if (dias <= 7) return 'text-orange-400 font-semibold';
    return 'text-green-400 font-medium';
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-600/20 rounded-xl">
            <Users size={28} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-dashboard-text">SUSCRIPCIONES</h1>
            <p className="text-dashboard-text-secondary text-sm">Gestión de suscripciones de usuarios</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <SubscriptionsFilters plans={plans} values={filters} onChange={setFilters} />

      {/* Estados de carga y error */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-600/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-400" />
          <div>
            <p className="font-bold">Error al cargar</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Tabla de suscripciones */}
      {!loading && !error && (
        <div className="bg-dashboard-accent/30 rounded-xl border border-dashboard-accent/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-dashboard-accent/50">
                <tr>
                  <th className="py-4 px-4 text-left font-black text-dashboard-text text-sm uppercase tracking-wide border-r border-dashboard-accent/30">
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      USUARIO
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left font-black text-dashboard-text text-sm uppercase tracking-wide border-r border-dashboard-accent/30">
                    TELÉFONO
                  </th>
                  <th className="py-4 px-4 text-left font-black text-dashboard-text text-sm uppercase tracking-wide border-r border-dashboard-accent/30">
                    PLAN
                  </th>
                  <th className="py-4 px-4 text-left font-black text-dashboard-text text-sm uppercase tracking-wide border-r border-dashboard-accent/30">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      FECHAS
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left font-black text-dashboard-text text-sm uppercase tracking-wide border-r border-dashboard-accent/30">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      DÍAS RESTANTES
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left font-black text-dashboard-text text-sm uppercase tracking-wide border-r border-dashboard-accent/30">
                    ESTADO
                  </th>
                  <th className="py-4 px-4 text-left font-black text-dashboard-text text-sm uppercase tracking-wide">
                    ACCIONES
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashboard-accent/20">
                {items.map((s) => (
                  <tr 
                    key={s.id} 
                    className="
                      transition-all duration-300 hover:bg-black hover:bg-opacity-80
                      hover:shadow-lg group
                    "
                  >
                    <td className="py-4 px-4 border-r border-dashboard-accent/30">
                      <div className="font-semibold text-dashboard-text group-hover:text-white transition-colors">
                        {s.usuario?.nombre_completo}
                      </div>
                      <div className="text-xs text-dashboard-text-secondary group-hover:text-gray-300 transition-colors">
                        {s.usuario?.email}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-dashboard-text group-hover:text-white transition-colors border-r border-dashboard-accent/30">
                      {s.usuario?.telefono || '-'}
                    </td>
                    <td className="py-4 px-4 text-dashboard-text group-hover:text-white transition-colors border-r border-dashboard-accent/30">
                      <span className="font-medium">{s.plan?.nombre}</span>
                    </td>
                    <td className="py-4 px-4 border-r border-dashboard-accent/30">
                      <div className="text-dashboard-text group-hover:text-white transition-colors">
                        <div className="text-xs text-dashboard-text-secondary group-hover:text-gray-300">Inicio:</div>
                        <div className="text-sm font-medium">{new Date(s.fecha_inicio).toLocaleDateString()}</div>
                      </div>
                      <div className="text-dashboard-text group-hover:text-white transition-colors mt-1">
                        <div className="text-xs text-dashboard-text-secondary group-hover:text-gray-300">Fin:</div>
                        <div className="text-sm font-medium">{new Date(s.fecha_fin).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 border-r border-dashboard-accent/30">
                      <span className={`text-lg font-bold ${getDaysColor(s.dias_restantes)} group-hover:text-white`}>
                        {s.dias_restantes}
                      </span>
                    </td>
                    <td className="py-4 px-4 border-r border-dashboard-accent/30">
                      <span className={`
                        inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border
                        ${getStatusColor(s.computed_estado)}
                        group-hover:text-white group-hover:border-white/50
                      `}>
                        {s.computed_estado.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
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

          {/* Estado vacío */}
          {items.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-dashboard-text text-xl font-black">No se encontraron suscripciones</p>
              <p className="text-dashboard-text-secondary mt-2">
                {filters.search || filters.planId || filters.estado ? 
                  'Intenta ajustar los filtros de búsqueda' : 
                  'No hay suscripciones registradas'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modales */}
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