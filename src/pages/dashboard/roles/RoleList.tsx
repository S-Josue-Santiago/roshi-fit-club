// roshi_fit/src/pages/dashboard/roles/RoleList.tsx
import React, { useState, useEffect } from 'react';
import { fetchRoles } from '../../../api/roleApi';
import { type Role } from '../../../types/Role';
import RoleFilters from './RoleFilters';
import RoleActions from './RoleActions';

const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', estado: '' });

  useEffect(() => {
    const loadRoles = async () => {
      setLoading(true);
      try {
        const data = await fetchRoles(filters);
        setRoles(data);
      } catch (error) {
        console.error('Error al cargar roles:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRoles();
  }, [filters]);

  const handleAddRole = () => {
    alert('Funcionalidad de "Crear Nuevo Rol" en desarrollo.');
  };

  const formatStatus = (estado: string) => {
    return estado === 'activo' 
      ? <span className="text-green-400">✅ Activo</span>
      : <span className="text-yellow-400">⏸️ Inactivo</span>;
  };

  return (
    <div className="bg-dashboard-accent/30 p-6 rounded-xl border border-dashboard-accent">
      <RoleFilters onFilterChange={setFilters} onAddRole={handleAddRole} />

      {loading ? (
        <p className="text-dashboard-text py-6 text-center">Cargando roles...</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-dashboard-text">
            <thead>
              <tr className="border-b border-dashboard-accent">
                <th className="py-3 px-4 text-left">NOMBRE</th>
                <th className="py-3 px-4 text-left">DESCRIPCIÓN</th>
                <th className="py-3 px-4 text-left">ESTADO</th>
                <th className="py-3 px-4 text-left">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className="border-b border-dashboard-accent/50 hover:bg-dashboard-accent/20">
                  <td className="py-3 px-4 font-medium">{role.nombre}</td>
                  <td className="py-3 px-4 text-dashboard-text-secondary max-w-xs truncate">
                    {role.descripcion || '—'}
                  </td>
                  <td className="py-3 px-4">{formatStatus(role.estado)}</td>
                  <td className="py-3 px-4">
                    <RoleActions role={role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {roles.length === 0 && !loading && (
            <p className="text-dashboard-text text-center py-6">No se encontraron roles.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RoleList;