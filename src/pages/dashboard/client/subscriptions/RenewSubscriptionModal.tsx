// roshi_fit/src/pages/dashboard/client/subscriptions/RenewSubscriptionModal.tsx
import React, { useEffect, useState } from 'react';
import { renewSubscription } from '../../../../api/subscriptionApi';
import api from '../../../../api/axiosInstance';
import { X, Save, Award, CreditCard, RefreshCw } from 'lucide-react';

interface Props {
  usuarioId: number; // ✅ ID del usuario
  onClose: () => void;
  onSuccess: () => void;
}

interface Plan {
  id: number;
  nombre: string;
  precio_q: string;
}

interface PaymentMethod {
  id: number;
  nombre: string;
}

const RenewSubscriptionModal: React.FC<Props> = ({ usuarioId, onClose, onSuccess }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [metodos, setMetodos] = useState<PaymentMethod[]>([]);
  const [planId, setPlanId] = useState('');
  const [metodoPagoId, setMetodoPagoId] = useState('');
  const [detalles, setDetalles] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, m] = await Promise.all([
          api.get<Plan[]>('/plans/for-registration').then(r => r.data),
          api.get<PaymentMethod[]>('/payment-methods/active').then(r => r.data)
        ]);
        const allowedIds = [1, 3, 4]; // IDs para Tarjeta, Depósito Bancario y PayPal
        const filteredMethods = m.filter(method => allowedIds.includes(method.id));
        setPlans(p);
        setMetodos(filteredMethods);
        if (p.length > 0) setPlanId(String(p[0].id));
        if (m.length > 0) setMetodoPagoId(String(m[0].id));
      } catch (e) {
        setError('No se pudieron cargar planes o métodos de pago.');
      }
    };
    load();
  }, []);

  const renderMetodoFields = () => {
    const metodo = metodos.find(m => String(m.id) === metodoPagoId)?.nombre || '';
    switch (metodo) {
      case 'Tarjeta':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Número de tarjeta" onChange={e=>setDetalles({ ...detalles, numero_tarjeta: e.target.value })} />
            <input className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Titular" onChange={e=>setDetalles({ ...detalles, titular: e.target.value })} />
            <input className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Exp (MM/AA)" onChange={e=>setDetalles({ ...detalles, exp: e.target.value })} />
            <input className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="CVV" onChange={e=>setDetalles({ ...detalles, cvv: e.target.value })} />
          </div>
        );
      case 'PayPal':
        return (
          <input className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Email de PayPal" onChange={e=>setDetalles({ ...detalles, paypal_email: e.target.value })} />
        );
      case 'Depósito Bancario':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Banco" onChange={e=>setDetalles({ ...detalles, banco: e.target.value })} />
            <input className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="Referencia" onChange={e=>setDetalles({ ...detalles, referencia: e.target.value })} />
          </div>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!planId || !metodoPagoId) {
      setError('Seleccione plan y método de pago.');
      return;
    }
    try {
      setLoading(true);
      await renewSubscription({ 
        usuario_id: usuarioId, 
        plan_id: Number(planId), 
        metodo_pago_id: Number(metodoPagoId), 
        detalles 
      });
      onSuccess();
    } catch (e) {
      setError('Error al renovar suscripción.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-white" onClick={onClose}>
      <div className="bg-black p-6 rounded-2xl shadow-2xl w-full max-w-2xl border-2 border-dashboard-accent/50 max-h-[90vh] overflow-y-auto" onClick={(e)=>e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <RefreshCw size={24} className="text-green-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">RENOVAR SUSCRIPCIÓN</h2>
          </div>
          <button onClick={onClose} className="p-2 text-dashboard-text hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 transform hover:scale-110">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><Award size={16} className="text-green-400" />SELECCIONAR PLAN *</label>
              <select className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20" value={planId} onChange={(e)=>setPlanId(e.target.value)}>
                <option className="bg-black" value="">Seleccione plan...</option>
                {plans.map(p=> <option className="bg-black" key={p.id} value={p.id}>{p.nombre} - Q{p.precio_q}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2"><CreditCard size={16} className="text-green-400" />MÉTODO DE PAGO *</label>
              <select className="w-full p-3 bg-dashboard-bg text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20" value={metodoPagoId} onChange={(e)=>setMetodoPagoId(e.target.value)}>
                <option className="bg-black" value="">Seleccione método...</option>
                {metodos.map(m=> <option className="bg-black" key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>
          </div>

          {metodoPagoId && (
            <div className="p-4 bg-dashboard-accent/30 rounded-xl border-2 border-dashboard-accent/50">
              {renderMetodoFields()}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-dashboard-accent/50">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 text-dashboard-text font-bold border-2 border-dashboard-accent/50 rounded-xl hover:border-red-400 hover:text-red-400 hover:bg-red-400/10 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-600 transition-all flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  PROCESANDO...
                </>
              ) : (
                <>
                  <Save size={18} />
                  FINALIZAR RENOVACIÓN
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenewSubscriptionModal;