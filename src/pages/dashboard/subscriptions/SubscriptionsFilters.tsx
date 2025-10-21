// roshi_fit/src/pages/dashboard/subscriptions/SubscriptionsFilters.tsx
import React from 'react';
import type { Plan } from '../../../types/Plan';

interface FiltersProps {
  plans: Plan[];
  values: {
    search: string;
    planId: string;
    estado: '' | 'activa' | 'vencida' | 'cancelada' | 'suspendida';
    orderDays: '' | 'asc' | 'desc';
  };
  onChange: (vals: FiltersProps['values']) => void;
}

const SubscriptionsFilters: React.FC<FiltersProps> = ({ plans, values, onChange }) => {
  const update = (patch: Partial<FiltersProps['values']>) => onChange({ ...values, ...patch });

  return (
    <div className="bg-dashboard-accent/40 p-4 rounded-lg border border-dashboard-accent mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
      <input
        type="text"
        placeholder="Buscar por nombre o email..."
        className="p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
        value={values.search}
        onChange={(e) => update({ search: e.target.value })}
      />

      <select
        className="p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
        value={values.planId}
        onChange={(e) => update({ planId: e.target.value })}
      >
        <option value="">Todos los planes</option>
        {plans.map((p) => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>

      <select
        className="p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
        value={values.estado}
        onChange={(e) => update({ estado: e.target.value as any })}
      >
        <option value="">Todos los estados</option>
        <option value="activa">Activa</option>
        <option value="vencida">Vencida</option>
        <option value="cancelada">Cancelada</option>
        <option value="suspendida">Suspendida</option>
      </select>

      <select
        className="p-2 bg-dashboard-bg text-dashboard-text rounded border border-dashboard-accent"
        value={values.orderDays}
        onChange={(e) => update({ orderDays: e.target.value as any })}
      >
        <option value="">Ordenar por días restantes</option>
        <option value="asc">Próximos a vencer (asc)</option>
        <option value="desc">Más tiempo restante (desc)</option>
      </select>
    </div>
  );
};

export default SubscriptionsFilters;
