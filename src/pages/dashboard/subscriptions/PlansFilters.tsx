// roshi_fit/src/pages/dashboard/subscriptions/PlansFilters.tsx
import React, { useState } from 'react';

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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="w-full md:w-1/3">
        <input
          type="text"
          placeholder="🔍 Buscar plan..."
          value={search}
          onChange={handleSearchChange}
          className="w-full p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent focus:ring-dashboard-primary focus:border-dashboard-primary"
        />
      </div>
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        <button
          onClick={onAddPlan}
          className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded-lg hover:bg-dashboard-secondary transition-colors"
        >
          + Nuevo Plan
        </button>
        <button
          onClick={onViewMemberships}
          className="px-4 py-2 bg-dashboard-secondary text-dashboard-bg font-semibold rounded-lg hover:bg-gold transition-colors"
        >
          Ver Membresías
        </button>
      </div>
    </div>
  );
};

export default PlansFilters;