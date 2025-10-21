// roshi_fit/src/pages/dashboard/equipment/EquipmentList.tsx
import React, { useState, useEffect } from 'react';
import { fetchEquipment } from '../../../api/equipmentApi';
import type { Equipment, EquipmentFilters } from '../../../types/Equipment';
import EquipmentFiltersComponent from './EquipmentFilters';
import EquipmentActions from './EquipmentActions';
import CreateEquipmentModal from './CreateEquipmentModal';
import EditEquipmentModal from './EditEquipmentModal';

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

  useEffect(() => {
    const loadEquipment = async () => {
      setLoading(true);
      try {
        const data = await fetchEquipment(filters);
        setEquipment(data);
      } catch (error) {
        console.error('Error al cargar equipos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEquipment();
  }, [filters]);

  const handleAddEquipment = () => setIsCreateModalOpen(true);
  const handleCreateSuccess = () => setFilters({ search: '', tipo: '', estado_equipo: '', estado: '' });
  const handleEdit = (id: number) => setEditingEquipmentId(id);
  const handleUpdateSuccess = () => setFilters(prev => ({ ...prev }));

  const formatStatus = (estado: string) => {
    return estado === 'activo' 
      ? <span className="text-green-400">✅ Activo</span>
      : <span className="text-yellow-400">⏸️ Inactivo</span>;
  };

  const formatEquipmentStatus = (estado: string) => {
    const map: Record<string, { text: string; color: string }> = {
      funcional: { text: '✅ Funcional', color: 'text-green-400' },
      en_mantenimiento: { text: '🔧 En Mantenimiento', color: 'text-yellow-400' },
      fuera_de_servicio: { text: '❌ Fuera de Servicio', color: 'text-red-400' },
    };
    return map[estado] ? <span className={map[estado].color}>{map[estado].text}</span> : estado;
  };

  return (
    <div className="bg-dashboard-accent/30 p-6 rounded-xl border border-dashboard-accent">
      <EquipmentFiltersComponent onFilterChange={setFilters} onAddEquipment={handleAddEquipment} />

      {loading ? (
        <p className="text-dashboard-text py-6 text-center">Cargando equipos...</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-dashboard-text">
            <thead>
              <tr className="border-b border-dashboard-accent">
                <th className="py-3 px-4 text-left">IMAGEN</th>
                <th className="py-3 px-4 text-left">NOMBRE</th>
                <th className="py-3 px-4 text-left">TIPO</th>
                <th className="py-3 px-4 text-left">MARCA</th>
                <th className="py-3 px-4 text-left">MODELO</th>
                <th className="py-3 px-4 text-left">NÚMERO</th>
                <th className="py-3 px-4 text-left">UBICACIÓN</th>
                <th className="py-3 px-4 text-left">ESTADO EQUIPO</th>
                <th className="py-3 px-4 text-left">ESTADO</th>
                <th className="py-3 px-4 text-left">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map(eq => (
                <tr key={eq.id} className="border-b border-dashboard-accent/50 hover:bg-dashboard-accent/20">
                  <td className="py-3 px-4">
                    {eq.imagen ? (
                      <img
                        src={`/assets/products/${eq.imagen}`}
                        alt={eq.nombre}
                        className="w-12 h-12 object-cover rounded border border-dashboard-accent"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-dashboard-accent rounded flex items-center justify-center text-xs">
                        —
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium">{eq.nombre}</td>
                  <td className="py-3 px-4">{eq.tipo || '—'}</td>
                  <td className="py-3 px-4">{eq.marca || '—'}</td>
                  <td className="py-3 px-4">{eq.modelo || '—'}</td>
                  <td className="py-3 px-4">{eq.numero_serie || '—'}</td>
                  <td className="py-3 px-4">{eq.ubicacion || '—'}</td>
                  <td className="py-3 px-4">{formatEquipmentStatus(eq.estado_equipo)}</td>
                  <td className="py-3 px-4">{formatStatus(eq.estado)}</td>
                  <td className="py-3 px-4">
                    <EquipmentActions
                      equipment={eq}
                      onEdit={handleEdit}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {equipment.length === 0 && !loading && (
            <p className="text-dashboard-text text-center py-6">No se encontraron equipos.</p>
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