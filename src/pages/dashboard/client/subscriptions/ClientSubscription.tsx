// roshi_fit/src/pages/dashboard/client/subscriptions/ClientSubscription.tsx
import React, { useState, useEffect } from 'react';
import { fetchSubscriptionHistory } from '../../../../api/subscriptionApi';
import RenewSubscriptionModal from './RenewSubscriptionModal';
import CancelSubscriptionModal from './CancelSubscriptionModal';
import { 
  Calendar, Clock, DollarSign, Package, AlertTriangle, 
  CheckCircle, XCircle, PauseCircle, CreditCard, TrendingUp,
  Award, RefreshCw
} from 'lucide-react';

interface Subscription {
  id: number;
  plan: { nombre: string; precio_q: string; duracion_dias: number };
  fecha_inicio: string;
  fecha_fin: string;
  estado_suscripcion: 'activa' | 'vencida' | 'cancelada' | 'suspendida';
  dias_restantes: number;
  computed_estado: 'activa' | 'vencida' | 'cancelada' | 'suspendida';
}

// Hook para detectar el tema del dashboard
const useDashboardThemeDetection = () => {
  const [detectedTheme, setDetectedTheme] = useState<'nocturno' | 'amanecer'>('nocturno');

  useEffect(() => {
    const checkTheme = () => {
      const bodyClass = document.body.className;
      if (bodyClass.includes('theme-dashboard-amanecer')) {
        setDetectedTheme('amanecer');
      } else {
        setDetectedTheme('nocturno');
      }
    };

    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return detectedTheme;
};

const ClientSubscription: React.FC = () => {
  const theme = useDashboardThemeDetection();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
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
          const today = new Date();
          const activeAndFutureSubscriptions = history
            .filter(sub => sub.estado_suscripcion === 'activa')
            .map(sub => {
              const fin = new Date(sub.fecha_fin);
              const msDiff = fin.getTime() - today.getTime();
              const dias_restantes = Math.max(0, Math.ceil(msDiff / (1000 * 60 * 60 * 24)));
              const computed_estado = fin < today ? 'vencida' : sub.estado_suscripcion;
              return {
                ...sub,
                plan: sub.planes_suscripcion,
                dias_restantes,
                computed_estado,
              };
            });
          setSubscriptions(activeAndFutureSubscriptions);
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

  // Estilos según tema
  const getStyles = () => {
    if (theme === 'amanecer') {
      return {
        container: 'bg-white border-slate-300',
        containerShadow: '0 20px 40px rgba(74, 144, 226, 0.15)',
        header: 'text-gray-900',
        headerSubtext: 'text-gray-600',
        headerIcon: 'bg-blue-100 text-blue-600',
        infoCard: 'bg-gradient-to-br from-slate-50 to-white border-slate-200',
        label: 'text-gray-600',
        value: 'text-gray-900',
        priceValue: 'text-blue-600',
        sectionTitle: 'text-gray-900 border-slate-300',
        statusBadge: {
          activa: 'bg-green-100 text-green-700 border-green-400',
          vencida: 'bg-yellow-100 text-yellow-700 border-yellow-400',
          cancelada: 'bg-red-100 text-red-700 border-red-400',
          suspendida: 'bg-purple-100 text-purple-700 border-purple-400'
        },
        statusIcon: {
          activa: 'text-green-600',
          vencida: 'text-yellow-600',
          cancelada: 'text-red-600',
          suspendida: 'text-purple-600'
        },
        daysColor: {
          critical: 'text-red-600',
          warning: 'text-yellow-600',
          caution: 'text-orange-600',
          good: 'text-green-600'
        },
        renewButton: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
        renewButtonShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
        cancelButton: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
        cancelButtonShadow: '0 8px 20px rgba(239, 68, 68, 0.4)',
        emptyContainer: 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200',
        emptyTitle: 'text-gray-900',
        emptyText: 'text-gray-600',
        loadingSpinner: 'border-blue-500',
        errorContainer: 'bg-red-50 border-red-300 text-red-700',
        errorIcon: 'text-red-600'
      };
    }
    
    // Tema Nocturno
    return {
      container: 'bg-[#16213E]/50 border-purple-500/30',
      containerShadow: '0 20px 40px rgba(138, 43, 226, 0.3)',
      header: 'text-white',
      headerSubtext: 'text-[#B0BEC5]',
      headerIcon: 'bg-cyan-500/20 text-cyan-400',
      infoCard: 'bg-[#0A0E27]/50 border-purple-500/20',
      label: 'text-[#B0BEC5]',
      value: 'text-white',
      priceValue: 'text-cyan-400',
      sectionTitle: 'text-white border-purple-500/30',
      statusBadge: {
        activa: 'bg-green-500/20 text-green-400 border-green-500/40',
        vencida: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
        cancelada: 'bg-red-500/20 text-red-400 border-red-500/40',
        suspendida: 'bg-purple-500/20 text-purple-400 border-purple-500/40'
      },
      statusIcon: {
        activa: 'text-green-400',
        vencida: 'text-yellow-400',
        cancelada: 'text-red-400',
        suspendida: 'text-purple-400'
      },
      daysColor: {
        critical: 'text-red-400',
        warning: 'text-yellow-400',
        caution: 'text-orange-400',
        good: 'text-green-400'
      },
      renewButton: 'bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800',
      renewButtonShadow: '0 8px 20px rgba(34, 211, 238, 0.5)',
      cancelButton: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
      cancelButtonShadow: '0 8px 20px rgba(239, 68, 68, 0.5)',
      emptyContainer: 'bg-gradient-to-br from-[#16213E] to-[#0A0E27] border-cyan-500/30',
      emptyTitle: 'text-white',
      emptyText: 'text-[#B0BEC5]',
      loadingSpinner: 'border-cyan-500',
      errorContainer: 'bg-red-900/20 border-red-500/40 text-red-300',
      errorIcon: 'text-red-400'
    };
  };

  const styles = getStyles();

  const getStatusConfig = (estado: string) => {
    const icons = {
      activa: <CheckCircle size={18} className={styles.statusIcon.activa} />,
      vencida: <AlertTriangle size={18} className={styles.statusIcon.vencida} />,
      cancelada: <XCircle size={18} className={styles.statusIcon.cancelada} />,
      suspendida: <PauseCircle size={18} className={styles.statusIcon.suspendida} />
    };
    
    return {
      color: styles.statusBadge[estado as keyof typeof styles.statusBadge] || styles.statusBadge.activa,
      icon: icons[estado as keyof typeof icons] || icons.activa,
      text: estado.toUpperCase()
    };
  };

  const getDaysColor = (dias: number) => {
    if (dias <= 0) return styles.daysColor.critical;
    if (dias <= 3) return styles.daysColor.warning;
    if (dias <= 7) return styles.daysColor.caution;
    return styles.daysColor.good;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-4 border-t-transparent ${styles.loadingSpinner} mx-auto mb-4`}></div>
          <p className={`${styles.header} font-bold`}>Cargando suscripción...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.errorContainer} p-6 rounded-3xl border-2 flex items-start gap-4`}>
        <AlertTriangle size={28} className={`${styles.errorIcon} `} />
        <div>
          <p className="font-black text-lg mb-1">Error al cargar</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div 
        className={`${styles.emptyContainer} p-10 rounded-3xl border-2 text-center`}
        style={{ boxShadow: styles.containerShadow }}
      >
        <div className="text-8xl mb-6">💎</div>
        <h2 className={`text-3xl font-black ${styles.emptyTitle} mb-4`}>
          SIN SUSCRIPCIÓN ACTIVA
        </h2>
        <p className={`${styles.emptyText} text-lg mb-8 max-w-md mx-auto`}>
          No tienes una suscripción activa. Adquiere un plan para acceder a todos los beneficios.
        </p>
        <button
          onClick={() => setIsRenewModalOpen(true)}
          className={`
            px-8 py-4 text-white font-black rounded-2xl 
            transition-all duration-300 transform hover:scale-105
            flex items-center justify-center gap-3 mx-auto text-lg
            ${styles.renewButton}
          `}
          style={{ boxShadow: styles.renewButtonShadow }}
        >
          <Award size={24} />
          ADQUIRIR SUSCRIPCIÓN
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {subscriptions.map((subscription, index) => {
        const statusConfig = getStatusConfig(subscription.computed_estado);
        return (
          <div 
            key={subscription.id}
            className={`${styles.container} p-8 rounded-3xl border-2`}
            style={{ boxShadow: styles.containerShadow }}
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-4 ${styles.headerIcon} rounded-2xl shadow-lg`}>
                  <CreditCard size={32} />
                </div>
                <div>
                  <h2 className={`text-3xl md:text-4xl font-black ${styles.header}`}>
                    {index === 0 ? "MI SUSCRIPCIÓN" : "SUSCRIPCIÓN FUTURA"}
                  </h2>
                  <p className={`${styles.headerSubtext} text-sm md:text-base font-semibold mt-1`}>
                    Administra tu plan
                  </p>
                </div>
              </div>
              
              {/* Badge de estado */}
              <div className={`
                inline-flex items-center gap-2 px-5 py-3 rounded-2xl border-2 font-black text-base
                ${statusConfig.color} shadow-lg
              `}>
                {statusConfig.icon}
                {statusConfig.text}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Información del plan */}
              <div className="space-y-6">
                <h3 className={`text-xl font-black ${styles.sectionTitle} border-b-2 pb-3 flex items-center gap-2`}>
                  <Package size={20} />
                  INFORMACIÓN DEL PLAN
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`${styles.infoCard} p-5 rounded-2xl border-2 transform hover:scale-105 transition-all duration-300`}>
                    <label className={`block text-xs font-black ${styles.label} mb-3 flex items-center gap-2`}><Award size={16} />PLAN</label>
                    <p className={`${styles.value} font-black text-xl`}>{subscription.plan.nombre}</p>
                  </div>
                  <div className={`${styles.infoCard} p-5 rounded-2xl border-2 transform hover:scale-105 transition-all duration-300`}>
                    <label className={`block text-xs font-black ${styles.label} mb-3 flex items-center gap-2`}><DollarSign size={16} />PRECIO</label>
                    <p className={`${styles.priceValue} font-black text-2xl`}>Q{subscription.plan.precio_q}</p>
                  </div>
                  <div className={`${styles.infoCard} p-5 rounded-2xl border-2 sm:col-span-2 transform hover:scale-105 transition-all duration-300`}>
                    <label className={`block text-xs font-black ${styles.label} mb-3 flex items-center gap-2`}><TrendingUp size={16} />DURACIÓN</label>
                    <p className={`${styles.value} font-black text-xl`}>{subscription.plan.duracion_dias} días</p>
                  </div>
                </div>
              </div>

              {/* Fechas y estado */}
              <div className="space-y-6">
                <h3 className={`text-xl font-black ${styles.sectionTitle} border-b-2 pb-3 flex items-center gap-2`}>
                  <Calendar size={20} />
                  DETALLES TEMPORALES
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`${styles.infoCard} p-5 rounded-2xl border-2 transform hover:scale-105 transition-all duration-300`}>
                    <label className={`block text-xs font-black ${styles.label} mb-3 flex items-center gap-2`}><Calendar size={16} />INICIO</label>
                    <p className={`${styles.value} font-bold text-base`}>{new Date(subscription.fecha_inicio).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className={`${styles.infoCard} p-5 rounded-2xl border-2 transform hover:scale-105 transition-all duration-300`}>
                    <label className={`block text-xs font-black ${styles.label} mb-3 flex items-center gap-2`}><Calendar size={16} />FINALIZA</label>
                    <p className={`${styles.value} font-bold text-base`}>{new Date(subscription.fecha_fin).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className={`${styles.infoCard} p-5 rounded-2xl border-2 sm:col-span-2 transform hover:scale-105 transition-all duration-300`}>
                    <label className={`block text-xs font-black ${styles.label} mb-3 flex items-center gap-2`}><Clock size={16} />DÍAS RESTANTES</label>
                    <p className={`text-5xl font-black ${getDaysColor(subscription.dias_restantes)}`}>{subscription.dias_restantes}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción (solo para la primera/actual suscripción) */}
            {index === 0 && (
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2" style={{ borderColor: theme === 'amanecer' ? '#cbd5e1' : 'rgba(138, 43, 226, 0.3)' }}>
                <button
                  onClick={() => setIsRenewModalOpen(true)}
                  className={`flex-1 px-6 py-4 text-white font-black rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 ${styles.renewButton}`}
                  style={{ boxShadow: styles.renewButtonShadow }}
                >
                  <RefreshCw size={20} />
                  RENOVAR O CAMBIAR PLAN
                </button>
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className={`flex-1 px-6 py-4 text-white font-black rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 ${styles.cancelButton}`}
                  style={{ boxShadow: styles.cancelButtonShadow }}
                >
                  <XCircle size={20} />
                  CANCELAR SUSCRIPCIÓN
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Modales */}
      {isRenewModalOpen && userId !== null && (
        <RenewSubscriptionModal
          usuarioId={userId}
          onClose={() => setIsRenewModalOpen(false)}
          onSuccess={handleRenewSuccess}
        />
      )}

      {isCancelModalOpen && subscriptions.length > 0 && (
        <CancelSubscriptionModal
          subscriptionId={subscriptions[0].id}
          onClose={() => setIsCancelModalOpen(false)}
          onSuccess={handleCancelSuccess}
        />
      )}
    </div>
  );
};

export default ClientSubscription;