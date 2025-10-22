// roshi_fit/src/pages/dashboard/client/subscriptions/RenewSubscriptionModal.tsx
import React, { useEffect, useState } from 'react';
import { renewSubscription } from '../../../../api/subscriptionApi';
import api from '../../../../api/axiosInstance';

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
          api.get<PaymentMethod[]>('/payment-methods/active').then(r => r.data),
        ]);
        setPlans(p);
        setMetodos(m);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input className="p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent" placeholder="Número de tarjeta" onChange={e=>setDetalles({ ...detalles, numero_tarjeta: e.target.value })} />
            <input className="p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent" placeholder="Titular" onChange={e=>setDetalles({ ...detalles, titular: e.target.value })} />
            <input className="p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent" placeholder="Exp (MM/AA)" onChange={e=>setDetalles({ ...detalles, exp: e.target.value })} />
            <input className="p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent" placeholder="CVV" onChange={e=>setDetalles({ ...detalles, cvv: e.target.value })} />
          </div>
        );
      case 'PayPal':
        return (
          <input className="p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent w-full" placeholder="Email de PayPal" onChange={e=>setDetalles({ ...detalles, paypal_email: e.target.value })} />
        );
      case 'Depósito Bancario':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input className="p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent" placeholder="Banco" onChange={e=>setDetalles({ ...detalles, banco: e.target.value })} />
            <input className="p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent" placeholder="Referencia" onChange={e=>setDetalles({ ...detalles, referencia: e.target.value })} />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-dashboard-accent/90 p-6 rounded-xl shadow-2xl w-full max-w-2xl border border-dashboard-accent" onClick={(e)=>e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 border-b border-dashboard-accent pb-2">
          <h2 className="text-xl font-bold text-dashboard-text">Renovar Suscripción</h2>
          <button onClick={onClose} className="text-dashboard-text hover:text-dashboard-primary text-2xl">&times;</button>
        </div>

        {error && <div className="bg-red-800/50 text-red-200 p-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-dashboard-text-secondary mb-1">Plan</label>
              <select 
                className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent" 
                value={planId} 
                onChange={(e)=>setPlanId(e.target.value)}
              >
                {plans.map(p=> <option key={p.id} value={p.id}>{p.nombre} - Q{p.precio_q}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-dashboard-text-secondary mb-1">Método de pago</label>
              <select 
                className="w-full p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent" 
                value={metodoPagoId} 
                onChange={(e)=>setMetodoPagoId(e.target.value)}
              >
                {metodos.map(m=> <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>
          </div>

          {renderMetodoFields()}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-dashboard-text hover:text-dashboard-primary">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded hover:bg-dashboard-secondary transition-colors">
              {loading ? 'Procesando...' : 'Finalizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenewSubscriptionModal;