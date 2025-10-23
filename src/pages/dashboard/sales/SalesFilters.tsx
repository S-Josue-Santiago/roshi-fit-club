// roshi_fit/src/pages/dashboard/sales/SalesFilters.tsx
import React, { useEffect, useState } from 'react';
import api from '../../../api/axiosInstance';
import { Search, CreditCard, Calendar, Tag } from 'lucide-react';

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
    <div className="
      bg-dashboard-accent/20 p-4 rounded-xl border border-dashboard-accent/50 
      mb-6 grid grid-cols-1 lg:grid-cols-5 gap-4
    ">
      {/* Búsqueda */}
      <div>
        <label className=" text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
          <Search size={16} className="text-purple-400" />
          BUSCAR VENTAS
        </label>
        <div className="relative">
          <input
            type="text"
            className="
              w-full p-3 pl-10 bg-dashboard-bg text-dashboard-text 
              rounded-xl border-2 border-dashboard-accent/50
              focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
              hover:border-purple-400/50 transition-all duration-300
              placeholder:text-dashboard-text-secondary
              text-sm
            "
            placeholder="Cliente, email, factura..."
            value={values.search}
            onChange={(e)=>update({ search: e.target.value })}
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary" />
        </div>
      </div>

      {/* Estado de Orden */}
      <div>
        <label className=" text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
          <Tag size={16} className="text-purple-400" />
          ESTADO
        </label>
        <select
          className="
            w-full p-3 bg-dashboard-bg text-dashboard-text 
            rounded-xl border-2 border-dashboard-accent/50
            focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
            hover:border-purple-400/50 transition-all duration-300
            cursor-pointer text-sm
          "
          value={values.estado_orden}
          onChange={(e)=>update({ estado_orden: e.target.value as any })}
        >
          <option className="bg-black" value="">Todos los estados</option>
          <option className="bg-black" value="pendiente">Pendiente</option>
          <option className="bg-black" value="pagada">Pagada</option>
          <option className="bg-black" value="enviada">Enviada</option>
          <option className="bg-black" value="cancelada">Cancelada</option>
          <option className="bg-black" value="completada">Completada</option>
        </select>
      </div>

      {/* Método de Pago */}
      <div>
        <label className=" text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
          <CreditCard size={16} className="text-purple-400" />
          MÉTODO PAGO
        </label>
        <select
          className="
            w-full p-3 bg-dashboard-bg text-dashboard-text 
            rounded-xl border-2 border-dashboard-accent/50
            focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
            hover:border-purple-400/50 transition-all duration-300
            cursor-pointer text-sm
          "
          value={values.metodo_pago_id}
          onChange={(e)=>update({ metodo_pago_id: e.target.value })}
        >
          <option className="bg-black" value="">Todos los métodos</option>
          {methods.map(m => <option className="bg-black" key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
      </div>

      {/* Fecha Desde */}
      <div>
        <label className=" text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
          <Calendar size={16} className="text-purple-400" />
          DESDE
        </label>
        <input 
          type="date" 
          value={values.dateFrom} 
          onChange={(e)=>update({ dateFrom: e.target.value })}
          className="
            w-full p-3 bg-dashboard-bg text-dashboard-text 
            rounded-xl border-2 border-dashboard-accent/50
            focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
            hover:border-purple-400/50 transition-all duration-300
            cursor-pointer text-sm
          "
        />
      </div>

      {/* Fecha Hasta */}
      <div>
        <label className=" text-sm font-bold text-dashboard-text mb-2 flex items-center gap-2">
          <Calendar size={16} className="text-purple-400" />
          HASTA
        </label>
        <input 
          type="date" 
          value={values.dateTo} 
          onChange={(e)=>update({ dateTo: e.target.value })}
          className="
            w-full p-3 bg-dashboard-bg text-dashboard-text 
            rounded-xl border-2 border-dashboard-accent/50
            focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
            hover:border-purple-400/50 transition-all duration-300
            cursor-pointer text-sm
          "
        />
      </div>
    </div>
  );
};

export default SalesFilters;