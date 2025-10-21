// roshi_fit/src/pages/dashboard/sales/SalesFilters.tsx
import React, { useEffect, useState } from 'react';
import api from '../../../api/axiosInstance';

interface Props {
  values: {
    search: string;
    estado_orden: '' | 'pendiente' | 'pagada' | 'enviada' | 'cancelada' | 'completada';
    metodo_pago_id: string;
    dateFrom: string;
    dateTo: string;
  };
  onChange: (v: Props['values']) => void;
}

interface PaymentMethod { id: number; nombre: string }

const SalesFilters: React.FC<Props> = ({ values, onChange }) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    api.get<PaymentMethod[]>('/payment-methods/active').then(r => setMethods(r.data)).catch(()=>{});
  }, []);

  const update = (patch: Partial<Props['values']>) => onChange({ ...values, ...patch });

  return (
    <div className="bg-dashboard-accent/40 p-4 rounded-lg border border-dashboard-accent mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
      <input
        type="text"
        placeholder="Buscar por cliente, email o factura..."
        className="p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
        value={values.search}
        onChange={(e)=>update({ search: e.target.value })}
      />

      <select
        className="p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
        value={values.estado_orden}
        onChange={(e)=>update({ estado_orden: e.target.value as any })}
      >
        <option value="">Todos los estados</option>
        <option value="pendiente">Pendiente</option>
        <option value="pagada">Pagada</option>
        <option value="enviada">Enviada</option>
        <option value="cancelada">Cancelada</option>
        <option value="completada">Completada</option>
      </select>

      <select
        className="p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
        value={values.metodo_pago_id}
        onChange={(e)=>update({ metodo_pago_id: e.target.value })}
      >
        <option value="">Todos los métodos</option>
        {methods.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
      </select>

      <input type="date" value={values.dateFrom} onChange={(e)=>update({ dateFrom: e.target.value })} className="p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent" />
      <input type="date" value={values.dateTo} onChange={(e)=>update({ dateTo: e.target.value })} className="p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent" />
    </div>
  );
};

export default SalesFilters;
