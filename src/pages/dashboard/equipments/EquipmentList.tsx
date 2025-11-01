// roshi_fit/src/pages/dashboard/equipment/EquipmentList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { fetchEquipment, toggleEquipmentStatus } from '../../../api/equipmentApi';
import type { Equipment, EquipmentFilters } from '../../../types/Equipment';
import EquipmentFiltersComponent from './EquipmentFilters';
import EquipmentActions from './EquipmentActions';
import CreateEquipmentModal from './CreateEquipmentModal';
import EditEquipmentModal from './EditEquipmentModal';
import { Wrench, Image, Type, Tag, Hash, MapPin, Activity, CheckCircle, Swords , XCircle } from 'lucide-react';

const EquipmentList: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EquipmentFilters>({
    search: '',
    tipo: '',
    estado_equipo: '',
    estado: ''
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEquipmentId, setEditingEquipmentId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // New state to force data reload

  const loadEquipment = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEquipment(filters);
      setEquipment(data);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      alert(`Error al cargar equipos: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }, [filters, refreshTrigger]); // Add refreshTrigger to dependencies

  useEffect(() => {
    loadEquipment();
  }, [loadEquipment, refreshTrigger]); // Add refreshTrigger to dependencies

  const handleAddEquipment = () => setIsCreateModalOpen(true);
  const handleCreateSuccess = () => {
    loadEquipment(); // Reload all equipment after creation
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  }
  const handleEdit = (id: number) => setEditingEquipmentId(id);
  const handleUpdateSuccess = () => {
    loadEquipment(); // Reload all equipment after update
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  }

  const handleToggleStatus = async (id: number) => {
    try {
      await toggleEquipmentStatus(id);
      loadEquipment(); // Reload equipment to reflect the status change
      setRefreshTrigger(prev => prev + 1); // Trigger refresh
    } catch (error) {
      console.error('Error toggling equipment status:', error);
      alert(`Error al cambiar el estado del equipo: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const formatStatus = (estado: string) => {
    return estado === 'activo'
      ? <span className="flex items-center gap-1.5 text-green-400 bg-green-600/20 px-3 py-1 rounded-full text-sm font-bold border border-green-600/30"><CheckCircle size={16} /> Activo</span>
      : <span className="flex items-center gap-1.5 text-yellow-400 bg-yellow-600/20 px-3 py-1 rounded-full text-sm font-bold border border-yellow-600/30"><XCircle size={16} /> Inactivo</span>;
  };

  const formatEquipmentStatus = (estado: string) => {
    const map: Record<string, { text: string; icon: React.ReactNode; className: string }> = {
      funcional: { text: 'Funcional', icon: <CheckCircle size={16} />, className: 'text-green-400 bg-green-600/20 border-green-600/30' },
      en_mantenimiento: { text: 'Mantenimiento', icon: <Swords  size={16} />, className: 'text-yellow-400 bg-yellow-600/20 border-yellow-600/30' },
      fuera_de_servicio: { text: 'Fuera de Servicio', icon: <XCircle size={16} />, className: 'text-red-400 bg-red-600/20 border-red-600/30' },
    };
    const style = map[estado] || { text: estado, icon: null, className: 'text-gray-400 bg-gray-600/20' };
    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${style.className}`}>
        {style.icon}
        {style.text}
      </span>
    );
  };

  return (
    <div className="
      bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent
      shadow-lg hover:shadow-xl transition-all duration-300
    ">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-600/20 rounded-lg">
          <Wrench size={24} className="text-indigo-400" />
        </div>
        <h1 className="text-3xl font-black text-dashboard-text">EQUIPOS</h1>
      </div>

      <EquipmentFiltersComponent onFilterChange={setFilters} onAddEquipment={handleAddEquipment} />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dashboard-primary"></div>
        </div>
      ) : (
        <div className="overflow-x-auto mt-6">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-dashboard-accent/50 rounded-lg bg-dashboard-accent/10">
              <table className="min-w-full divide-y divide-dashboard-accent/30">
                <thead className="bg-dashboard-accent/50">
                  <tr>
                    <th scope="col" className="px-4 py-4 text-left text-base font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30"><div className="flex items-center gap-2"><Image size={18} className="text-indigo-400" /></div></th>
                    <th scope="col" className="px-4 py-4 text-left text-base font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30"><div className="flex items-center gap-2"><Wrench size={18} className="text-indigo-400" />Nombre</div></th>
                    <th scope="col" className="px-4 py-4 text-left text-base font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30"><div className="flex items-center gap-2"><Type size={18} className="text-indigo-400" />Tipo</div></th>
                    <th scope="col" className="px-4 py-4 text-left text-base font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30"><div className="flex items-center gap-2"><Tag size={18} className="text-indigo-400" />Marca</div></th>
                    <th scope="col" className="px-4 py-4 text-left text-base font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30"><div className="flex items-center gap-2"><Hash size={18} className="text-indigo-400" />Serie</div></th>
                    <th scope="col" className="px-4 py-4 text-left text-base font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30"><div className="flex items-center gap-2"><MapPin size={18} className="text-indigo-400" />Ubicación</div></th>
                    <th scope="col" className="px-4 py-4 text-left text-base font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30"><div className="flex items-center gap-2"><Activity size={18} className="text-indigo-400" />Estado Equipo</div></th>
                    <th scope="col" className="px-4 py-4 text-left text-base font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30"><div className="flex items-center gap-2"><Activity size={18} className="text-indigo-400" />Estado</div></th>
                    <th scope="col" className="px-4 py-4 text-left text-base font-black text-dashboard-text uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashboard-accent/20">
                  {equipment.map(eq => (
                    <tr key={eq.id} className="transition-all duration-300 hover:bg-black hover:bg-opacity-80 group bg-dashboard-accent/5">
                      <td className="px-4 py-4 whitespace-nowrap border-r border-dashboard-accent/30">
                        {eq.imagen ? (
                          <img src={`/assets/products/${eq.imagen}`} alt={eq.nombre} className="w-14 h-14 object-cover rounded-lg border-2 border-dashboard-accent/50 group-hover:border-indigo-500 transition-all duration-300 group-hover:scale-110" onError={(e) => (e.currentTarget.src = '/assets/placeholdermaquinas.png')} />
                        ) : (
                          <div className="w-14 h-14 bg-dashboard-accent rounded-lg flex items-center justify-center text-dashboard-text-secondary border-2 border-dashboard-accent/50"><Wrench size={24} /></div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-base font-semibold text-dashboard-text group-hover:text-white border-r border-dashboard-accent/30">{eq.nombre}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-base text-dashboard-text-secondary group-hover:text-white border-r border-dashboard-accent/30">{eq.tipo || '—'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-base text-dashboard-text-secondary group-hover:text-white border-r border-dashboard-accent/30">{eq.marca || '—'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-base text-dashboard-text-secondary group-hover:text-white border-r border-dashboard-accent/30">{eq.numero_serie || '—'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-base text-dashboard-text-secondary group-hover:text-white border-r border-dashboard-accent/30">{eq.ubicacion || '—'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-base border-r border-dashboard-accent/30"><div className="group-hover:scale-105 transition-transform duration-300">{formatEquipmentStatus(eq.estado_equipo)}</div></td>
                      <td className="px-4 py-4 whitespace-nowrap text-base border-r border-dashboard-accent/30"><div className="group-hover:scale-105 transition-transform duration-300">{formatStatus(eq.estado)}</div></td>
                      <td className="px-4 py-4 whitespace-nowrap text-base"><EquipmentActions equipment={eq} onEdit={handleEdit} onToggleStatus={handleToggleStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {equipment.length === 0 && !loading && (
            <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
              <div className="text-6xl mb-4">🔩</div>
              <p className="text-dashboard-text text-xl font-black">No se encontraron equipos</p>
              <p className="text-dashboard-text-secondary mt-2 text-base font-medium">Intenta ajustar los filtros de búsqueda o crea un nuevo equipo.</p>
            </div>
          )}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateEquipmentModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateSuccess}
        />
      )}

      {editingEquipmentId && (
        <EditEquipmentModal
          equipmentId={editingEquipmentId}
          onClose={() => setEditingEquipmentId(null)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default EquipmentList;