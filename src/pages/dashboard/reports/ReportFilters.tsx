// roshi_fit/src/pages/dashboard/reports/ReportFilters.tsx
import React from 'react';

interface ReportFiltersProps {
  onSearchChange: (term: string) => void;
  onPeriodChange: (period: string) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ onSearchChange, onPeriodChange }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="w-full md:w-1/3">
        <input
          type="text"
          placeholder="🔍 Buscar reporte..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent focus:ring-dashboard-primary focus:border-dashboard-primary"
        />
      </div>
      <select
        onChange={(e) => onPeriodChange(e.target.value)}
        className="p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent"
      >
        <option value="today">Hoy</option>
        <option value="week">Esta semana</option>
        <option value="month">Este mes</option>
        <option value="custom">Personalizado</option>
      </select>
    </div>
  );
};

export default ReportFilters;