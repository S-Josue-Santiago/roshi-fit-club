// roshi_fit/src/pages/dashboard/client/subscriptions/ClientSubscription.tsx
import React, { useState, useEffect } from 'react';
import { fetchSubscriptionHistory } from '../../../../api/subscriptionApi';
import RenewSubscriptionModal from './RenewSubscriptionModal';
import CancelSubscriptionModal from './CancelSubscriptionModal';
import { Calendar, Clock, DollarSign, Package, AlertTriangle, CheckCircle, XCircle, PauseCircle } from 'lucide-react';

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
  const [userId, setUserId] = useState<number | null>(null);

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
        setUserId(user.id);
        const history = await fetchSubscriptionHistory(user.id);

        if (history.length > 0) {
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
    window.location.reload();
  };

  const handleCancelSuccess = () => {
    setIsCancelModalOpen(false);
    window.location.reload();
  };

  const getStatusConfig = (estado: string) => {
    const configs: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
      activa: {
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        icon: <CheckCircle size={16} className="text-green-400" />,
        text: 'ACTIVA'
      },
      vencida: {
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        icon: <AlertTriangle size={16} className="text-yellow-400" />,
        text: 'VENCIDA'
      },
      cancelada: {
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: <XCircle size={16} className="text-red-400" />,
        text: 'CANCELADA'
      },
      suspendida: {
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        icon: <PauseCircle size={16} className="text-purple-400" />,
        text: 'SUSPENDIDA'
      }
    };
    return configs[estado] || { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: null, text: estado };
  };

  const getDaysColor = (dias: number) => {
    if (dias <= 0) return 'text-red-400';
    if (dias <= 3) return 'text-yellow-400';
    if (dias <= 7) return 'text-orange-400';
    return 'text-green-400';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-600/20 border border-red-500/50 text-red-200 p-6 rounded-xl flex items-center gap-3">
        <AlertTriangle size={24} className="text-red-400" />
        <div>
          <p className="font-bold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-dashboard-accent/30 p-6 rounded-xl border-2 border-dashboard-accent/50 text-center">
        <div className="text-6xl mb-4">💎</div>
        <h2 className="text-2xl font-black text-dashboard-text mb-4">SIN SUSCRIPCIÓN ACTIVA</h2>
        <p className="text-dashboard-text-secondary mb-6">No tienes una suscripción activa en este momento.</p>
        <button
          onClick={() => setIsRenewModalOpen(true)}
          className="
            px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 
            text-white font-bold rounded-xl 
            hover:from-cyan-700 hover:to-cyan-800
            transition-all duration-300 transform hover:scale-105
            flex items-center justify-center gap-2 mx-auto
          "
        >
          <Package size={20} />
          ADQUIRIR SUSCRIPCIÓN
        </button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(subscription.computed_estado);

  return (
    <div className="bg-dashboard-accent/30 p-6 rounded-xl border-2 border-dashboard-accent/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-600/20 rounded-xl">
            <Package size={28} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-dashboard-text">MI SUSCRIPCIÓN</h2>
            <p className="text-dashboard-text-secondary text-sm">Detalles de tu plan actual</p>
          </div>
        </div>
        
        {/* Badge de estado */}
        <div className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-sm
          ${statusConfig.color}
        `}>
          {statusConfig.icon}
          {statusConfig.text}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Información del plan */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-dashboard-text border-b border-dashboard-accent/30 pb-2">
            INFORMACIÓN DEL PLAN
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-dashboard-accent/20 p-4 rounded-xl border border-dashboard-accent/30">
              <label className=" text-sm font-bold text-dashboard-text-secondary mb-2 flex items-center gap-2">
                <Package size={16} />
                PLAN
              </label>
              <p className="text-dashboard-text font-black text-lg">{subscription.plan.nombre}</p>
            </div>

            <div className="bg-dashboard-accent/20 p-4 rounded-xl border border-dashboard-accent/30">
              <label className=" text-sm font-bold text-dashboard-text-secondary mb-2 flex items-center gap-2">
                <DollarSign size={16} />
                PRECIO
              </label>
              <p className="text-cyan-400 font-black text-lg">Q{subscription.plan.precio_q}</p>
            </div>

            <div className="bg-dashboard-accent/20 p-4 rounded-xl border border-dashboard-accent/30">
              <label className=" text-sm font-bold text-dashboard-text-secondary mb-2">
                DURACIÓN
              </label>
              <p className="text-dashboard-text font-semibold">{subscription.plan.duracion_dias} días</p>
            </div>
          </div>
        </div>

        {/* Fechas y estado */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-dashboard-text border-b border-dashboard-accent/30 pb-2">
            DETALLES TEMPORALES
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-dashboard-accent/20 p-4 rounded-xl border border-dashboard-accent/30">
              <label className=" text-sm font-bold text-dashboard-text-secondary mb-2 flex items-center gap-2">
                <Calendar size={16} />
                INICIO
              </label>
              <p className="text-dashboard-text font-semibold">
                {new Date(subscription.fecha_inicio).toLocaleDateString('es-GT')}
              </p>
            </div>

            <div className="bg-dashboard-accent/20 p-4 rounded-xl border border-dashboard-accent/30">
              <label className=" text-sm font-bold text-dashboard-text-secondary mb-2 flex items-center gap-2">
                <Calendar size={16} />
                FIN
              </label>
              <p className="text-dashboard-text font-semibold">
                {new Date(subscription.fecha_fin).toLocaleDateString('es-GT')}
              </p>
            </div>

            <div className="bg-dashboard-accent/20 p-4 rounded-xl border border-dashboard-accent/30">
              <label className=" text-sm font-bold text-dashboard-text-secondary mb-2 flex items-center gap-2">
                <Clock size={16} />
                DÍAS RESTANTES
              </label>
              <p className={`text-2xl font-black ${getDaysColor(subscription.dias_restantes)}`}>
                {subscription.dias_restantes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-dashboard-accent/30">
        <button
          onClick={() => setIsRenewModalOpen(true)}
          className="
            flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 
            text-white font-bold rounded-xl 
            hover:from-cyan-700 hover:to-cyan-800
            transition-all duration-300 transform hover:scale-105
            flex items-center justify-center gap-2
          "
        >
          <Package size={20} />
          RENOVAR SUSCRIPCIÓN
        </button>
        <button
          onClick={() => setIsCancelModalOpen(true)}
          className="
            flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 
            text-white font-bold rounded-xl 
            hover:from-red-700 hover:to-red-800
            transition-all duration-300 transform hover:scale-105
            flex items-center justify-center gap-2
          "
        >
          <XCircle size={20} />
          CANCELAR SUSCRIPCIÓN
        </button>
      </div>

      {/* Modales */}
      {isRenewModalOpen && userId !== null && (
        <RenewSubscriptionModal
          usuarioId={userId}
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