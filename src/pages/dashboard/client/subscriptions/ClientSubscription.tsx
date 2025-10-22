// roshi_fit/src/pages/dashboard/client/subscriptions/ClientSubscription.tsx
import React, { useState, useEffect } from 'react';
import { fetchSubscriptionHistory } from '../../../../api/subscriptionApi';
import RenewSubscriptionModal from './RenewSubscriptionModal';
import CancelSubscriptionModal from './CancelSubscriptionModal';

interface Subscription {
  id: number;
  plan: { nombre: string; precio_q: string; duracion_dias: number };
  fecha_inicio: string;
  fecha_fin: string;
  estado_suscripcion: 'activa' | 'vencida' | 'cancelada' | 'suspendida';
  dias_restantes: number;
  computed_estado: 'activa' | 'vencida' | 'cancelada' | 'suspendida';
}

const ClientSubscription: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null); // Add this line

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const userData = localStorage.getItem('userData');
        if (!userData) {
          setError('Usuario no autenticado.');
          setLoading(false);
          return;
        }

        const user = JSON.parse(userData);
        setUserId(user.id); // Set userId here
        const history = await fetchSubscriptionHistory(user.id);

        if (history.length > 0) {
          // Tomar la suscripción más reciente
          const latest = history[0];
          const today = new Date();
          const fin = new Date(latest.fecha_fin);
          const msDiff = fin.getTime() - today.getTime();
          const dias_restantes = Math.max(0, Math.floor(msDiff / (1000 * 60 * 60 * 24)));
          const computed_estado = fin < today ? 'vencida' : latest.estado_suscripcion;

          setSubscription({
            id: latest.id,
            plan: latest.planes_suscripcion,
            fecha_inicio: latest.fecha_inicio,
            fecha_fin: latest.fecha_fin,
            estado_suscripcion: latest.estado_suscripcion,
            dias_restantes,
            computed_estado,
          });
        }
      } catch (err) {
        setError('Error al cargar la suscripción.');
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, []);

  const handleRenewSuccess = () => {
    setIsRenewModalOpen(false);
    // Recargar suscripción
    window.location.reload();
  };

  const handleCancelSuccess = () => {
    setIsCancelModalOpen(false);
    window.location.reload();
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activa': return 'text-green-400';
      case 'vencida': return 'text-yellow-400';
      case 'cancelada': return 'text-red-400';
      case 'suspendida': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (estado: string) => {
    const texts: Record<string, string> = {
      activa: '✅ Activa',
      vencida: '⚠️ Vencida',
      cancelada: '❌ Cancelada',
      suspendida: '⏸️ Suspendida'
    };
    return texts[estado] || estado;
  };

  if (loading) {
    return <p className="text-dashboard-text">Cargando suscripción...</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  if (!subscription) {
    return (
      <div className="bg-dashboard-accent/30 p-6 rounded-xl border border-dashboard-accent">
        <h2 className="text-xl font-bold text-dashboard-text mb-4">Suscripción</h2>
        <p className="text-dashboard-text">No tienes una suscripción activa.</p>
        <button
          onClick={() => setIsRenewModalOpen(true)}
          className="mt-4 px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded hover:bg-dashboard-secondary transition-colors"
        >
          Renovar Suscripción
        </button>
      </div>
    );
  }

  return (
    <div className="bg-dashboard-accent/30 p-6 rounded-xl border border-dashboard-accent">
      <h2 className="text-xl font-bold text-dashboard-text mb-6">Mi Suscripción</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información del plan */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-dashboard-text-secondary">Plan</label>
            <p className="text-dashboard-text font-semibold">{subscription.plan.nombre}</p>
          </div>
          <div>
            <label className="block text-sm text-dashboard-text-secondary">Precio</label>
            <p className="text-dashboard-primary font-bold">Q{subscription.plan.precio_q}</p>
          </div>
          <div>
            <label className="block text-sm text-dashboard-text-secondary">Duración</label>
            <p className="text-dashboard-text">{subscription.plan.duracion_dias} días</p>
          </div>
        </div>

        {/* Fechas y estado */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-dashboard-text-secondary">Inicio</label>
            <p className="text-dashboard-text">
              {new Date(subscription.fecha_inicio).toLocaleDateString('es-GT')}
            </p>
          </div>
          <div>
            <label className="block text-sm text-dashboard-text-secondary">Fin</label>
            <p className="text-dashboard-text">
              {new Date(subscription.fecha_fin).toLocaleDateString('es-GT')}
            </p>
          </div>
          <div>
            <label className="block text-sm text-dashboard-text-secondary">Días Restantes</label>
            <p className={`text-xl font-bold ${subscription.dias_restantes <= 3 ? 'text-red-400' : 'text-dashboard-primary'}`}>
              {subscription.dias_restantes}
            </p>
          </div>
          <div>
            <label className="block text-sm text-dashboard-text-secondary">Estado</label>
            <p className={getStatusColor(subscription.computed_estado)}>
              {getStatusText(subscription.computed_estado)}
            </p>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3 mt-8">
        <button
          onClick={() => setIsRenewModalOpen(true)}
          className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded hover:bg-dashboard-secondary transition-colors"
        >
          Renovar
        </button>
        <button
          onClick={() => setIsCancelModalOpen(true)}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-500 transition-colors"
        >
          Cancelar
        </button>
      </div>

      {/* Modales */}
      {isRenewModalOpen && userId !== null && ( // Add userId !== null condition
        <RenewSubscriptionModal
          usuarioId={userId} // Change subscription.id to userId
          onClose={() => setIsRenewModalOpen(false)}
          onSuccess={handleRenewSuccess}
        />
      )}

      {isCancelModalOpen && (
        <CancelSubscriptionModal
          subscriptionId={subscription.id}
          onClose={() => setIsCancelModalOpen(false)}
          onSuccess={handleCancelSuccess}
        />
      )}
    </div>
  );
};

export default ClientSubscription;