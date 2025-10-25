// roshi_fit/src/pages/dashboard/subscriptions/SubscriptionsFilters.tsx
import React from 'react';
import type { Plan } from '../../../types/Plan';
import { Search, Award, Activity, ArrowDownUp } from 'lucide-react';

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
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 p-4 bg-dashboard-accent/20 rounded-xl border border-dashboard-accent/50">
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full">
        <div className="w-full sm:w-auto sm:flex-1">
          <label className="block text-sm font-bold text-dashboard-text mb-2"><Search size={16} className="inline mr-2" />BUSCAR USUARIO</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Nombre o email..."
              className="w-full p-3 pl-10 bg-dashboard-accent text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 placeholder:text-dashboard-text-secondary text-sm"
              value={values.search}
              onChange={(e) => update({ search: e.target.value })}
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary" />
          </div>
        </div>
        <div className="w-full sm:w-auto sm:flex-1">
          <label className="block text-sm font-bold text-dashboard-text mb-2"><Award size={16} className="inline mr-2" />FILTRAR POR PLAN</label>
          <select
            className="w-full p-3 bg-dashboard-accent text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer text-sm"
            value={values.planId}
            onChange={(e) => update({ planId: e.target.value })}
          >
            <option className="bg-black" value="">Todos los planes</option>
            {plans.map((p) => (
              <option className="bg-black" key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-auto sm:flex-1">
          <label className="block text-sm font-bold text-dashboard-text mb-2"><Activity size={16} className="inline mr-2" />FILTRAR POR ESTADO</label>
          <select
            className="w-full p-3 bg-dashboard-accent text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer text-sm"
            value={values.estado}
            onChange={(e) => update({ estado: e.target.value as any })}
          >
            <option className="bg-black" value="">Todos los estados</option>
            <option className="bg-black" value="activa">Activa</option>
            <option className="bg-black" value="por_vencer">Por Vencer</option>
            <option className="bg-black" value="vencida">Vencida</option>
            <option className="bg-black" value="cancelada">Cancelada</option>
          </select>
        </div>
        <div className="w-full sm:w-auto sm:flex-1">
          <label className="block text-sm font-bold text-dashboard-text mb-2"><ArrowDownUp size={16} className="inline mr-2" />ORDENAR</label>
          <select
            className="w-full p-3 bg-dashboard-accent text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer text-sm"
            value={values.orderDays}
            onChange={(e) => update({ orderDays: e.target.value as any })}
          >
            <option className="bg-black" value="">Por defecto</option>
            <option className="bg-black" value="asc">Próximos a vencer</option>
            <option className="bg-black" value="desc">Más tiempo restante</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsFilters;
