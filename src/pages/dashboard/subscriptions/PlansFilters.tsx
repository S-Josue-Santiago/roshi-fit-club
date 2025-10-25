// roshi_fit/src/pages/dashboard/subscriptions/PlansFilters.tsx
import React, { useState } from 'react';
import { Search, Plus, Eye } from 'lucide-react';

interface PlansFiltersProps {
  onFilterChange: (filters: { search: string }) => void;
  onAddPlan: () => void;
  onViewMemberships: () => void;
}

const PlansFilters: React.FC<PlansFiltersProps> = ({ onFilterChange, onAddPlan, onViewMemberships }) => {
  const [search, setSearch] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ search: value });
  };

  return (
    <div className="
      flex flex-col lg:flex-row justify-between items-start lg:items-center 
      gap-4 mb-6 p-4 bg-dashboard-accent/20 rounded-xl border border-dashboard-accent/50
    ">
      <div className="w-full lg:w-1/3">
        <label className="block text-sm font-bold text-dashboard-text mb-2">
          <Search size={16} className="inline mr-2" />
          BUSCAR PLAN
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Nombre del plan..."
            value={search}
            onChange={handleSearchChange}
            className="
              w-full p-3 pl-10 bg-dashboard-accent text-dashboard-text 
              rounded-xl border-2 border-dashboard-accent/50
              focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
              hover:border-teal-400/50 transition-all duration-300
              placeholder:text-dashboard-text-secondary text-sm
            "
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        <button
          onClick={onAddPlan}
          className="
            w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 
            text-white font-bold rounded-xl hover:from-teal-700 hover:to-teal-800
            transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
            border-2 border-teal-500/30 flex items-center justify-center gap-2 group text-sm
          "
        >
          <Plus size={20} className="group-hover:scale-110 transition-transform" />
          <span>NUEVO PLAN</span>
        </button>
        <button
          onClick={onViewMemberships}
          className="
            w-full sm:w-auto px-6 py-3 bg-dashboard-accent/50 text-dashboard-text font-bold 
            rounded-xl border-2 border-dashboard-accent/50 hover:border-teal-400 
            hover:text-teal-300 transition-all duration-300 flex items-center justify-center gap-2 text-sm
          "
        >
          <Eye size={18} />
          <span>Ver Membresías</span>
        </button>
      </div>
    </div>
  );
};

export default PlansFilters;