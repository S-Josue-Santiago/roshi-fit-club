// roshi_fit/src/pages/dashboard/equipment/EquipmentFilters.tsx
import React, { useState, useEffect } from 'react';
import { fetchEquipmentTypes } from '../../../api/equipmentApi';
import { Search, Filter, Plus, Type, Activity } from 'lucide-react';

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
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 p-4 bg-dashboard-accent/20 rounded-xl border border-dashboard-accent/50">
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full lg:w-auto">
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-bold text-dashboard-text mb-2"><Search size={16} className="inline mr-2" />BUSCAR EQUIPO</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Nombre, marca, serie..."
              value={search}
              onChange={handleSearchChange}
              className="w-full sm:w-64 p-3 pl-10 bg-dashboard-accent text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-400/50 transition-all duration-300 placeholder:text-dashboard-text-secondary text-sm"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dashboard-text-secondary" />
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-bold text-dashboard-text mb-2"><Type size={16} className="inline mr-2" />TIPO</label>
          <select
            value={tipo}
            onChange={handleTipoChange}
            className="w-full p-3 bg-dashboard-accent text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-400/50 transition-all duration-300 cursor-pointer text-sm"
          >
            <option className="bg-black" value="">Todos</option>
            {types.map(t => (
              <option className="bg-black" key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-bold text-dashboard-text mb-2"><Activity size={16} className="inline mr-2" />ESTADO EQUIPO</label>
          <select
            value={estadoEquipo}
            onChange={handleEstadoEquipoChange}
            className="w-full p-3 bg-dashboard-accent text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-400/50 transition-all duration-300 cursor-pointer text-sm"
          >
            <option className="bg-black" value="">Todos</option>
            <option className="bg-black" value="funcional">Funcional</option>
            <option className="bg-black" value="en_mantenimiento">En Mantenimiento</option>
            <option className="bg-black" value="fuera_de_servicio">Fuera de Servicio</option>
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-bold text-dashboard-text mb-2"><Filter size={16} className="inline mr-2" />ESTADO REGISTRO</label>
          <select
            value={estado}
            onChange={handleEstadoChange}
            className="w-full p-3 bg-dashboard-accent text-dashboard-text rounded-xl border-2 border-dashboard-accent/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-400/50 transition-all duration-300 cursor-pointer text-sm"
          >
            <option className="bg-black" value="">Todos</option>
            <option className="bg-black" value="activo">Activo</option>
            <option className="bg-black" value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="w-full lg:w-auto mt-4 lg:mt-0">
        <button
          onClick={onAddEquipment}
          className="
            w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 
            text-white font-bold rounded-xl hover:from-indigo-700 hover:to-indigo-800
            transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
            border-2 border-indigo-500/30 flex items-center justify-center gap-2 group text-sm
          "
        >
          <Plus size={20} className="group-hover:scale-110 transition-transform" />
          <span>NUEVO EQUIPO</span>
        </button>
      </div>
    </div>
  );
};

export default EquipmentFilters;