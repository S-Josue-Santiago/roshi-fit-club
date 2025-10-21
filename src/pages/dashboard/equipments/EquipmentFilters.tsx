// roshi_fit/src/pages/dashboard/equipment/EquipmentFilters.tsx
import React, { useState, useEffect } from 'react';
import { fetchEquipmentTypes } from '../../../api/equipmentApi';

interface EquipmentFiltersProps {
  onFilterChange: (filters: {
    search: string;
    tipo: string;
    estado_equipo: string;
    estado: string;
  }) => void;
  onAddEquipment: () => void;
}

const EquipmentFilters: React.FC<EquipmentFiltersProps> = ({ onFilterChange, onAddEquipment }) => {
  const [search, setSearch] = useState('');
  const [tipo, setTipo] = useState('');
  const [estadoEquipo, setEstadoEquipo] = useState('');
  const [estado, setEstado] = useState('');
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchEquipmentTypes().then(setTypes).catch(console.error);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ search: value, tipo, estado_equipo: estadoEquipo, estado });
  };

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTipo(value);
    onFilterChange({ search, tipo: value, estado_equipo: estadoEquipo, estado });
  };

  const handleEstadoEquipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEstadoEquipo(value);
    onFilterChange({ search, tipo, estado_equipo: value, estado });
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEstado(value);
    onFilterChange({ search, tipo, estado_equipo: estadoEquipo, estado: value });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="w-full md:w-1/3">
        <input
          type="text"
          placeholder="🔍 Buscar equipo..."
          value={search}
          onChange={handleSearchChange}
          className="w-full p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent focus:ring-dashboard-primary focus:border-dashboard-primary"
        />
      </div>
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        <select
          value={tipo}
          onChange={handleTipoChange}
          className="p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent"
        >
          <option value="">Todos los tipos</option>
          {types.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={estadoEquipo}
          onChange={handleEstadoEquipoChange}
          className="p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent"
        >
          <option value="">Todos los estados</option>
          <option value="funcional">Funcional</option>
          <option value="en_mantenimiento">En Mantenimiento</option>
          <option value="fuera_de_servicio">Fuera de Servicio</option>
        </select>
        <select
          value={estado}
          onChange={handleEstadoChange}
          className="p-2 bg-dashboard-accent text-dashboard-text rounded-lg border border-dashboard-accent"
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <button
          onClick={onAddEquipment}
          className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded-lg hover:bg-dashboard-secondary transition-colors"
        >
          + Nuevo Equipo
        </button>
      </div>
    </div>
  );
};

export default EquipmentFilters;