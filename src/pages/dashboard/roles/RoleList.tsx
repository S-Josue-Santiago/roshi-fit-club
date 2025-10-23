// roshi_fit/src/pages/dashboard/roles/RoleList.tsx
import React, { useState, useEffect } from 'react';
import { fetchRoles } from '../../../api/roleApi';
import { type Role } from '../../../types/Role';
import RoleFilters from './RoleFilters';
import RoleActions from './RoleActions';
import { Shield, Users } from 'lucide-react';

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
      ? <span className="text-green-600 font-bold bg-green-600/20 px-3 py-1 rounded-full border border-green-600/30">✅ Activo</span>
      : <span className="text-yellow-600 font-bold bg-yellow-600/20 px-3 py-1 rounded-full border border-yellow-600/30">⏸️ Inactivo</span>;
  };

  return (
    <div className="
      bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent
      shadow-lg hover:shadow-xl transition-all duration-300
    ">
      <RoleFilters onFilterChange={setFilters} onAddRole={handleAddRole} />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dashboard-primary"></div>
        </div>
      ) : (
        <div className="overflow-x-auto mt-6">
          {/* Tabla responsiva */}
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-dashboard-accent/50 rounded-lg bg-dashboard-accent/10">
              <table className="min-w-full divide-y divide-dashboard-accent/30">
                <thead className="bg-dashboard-accent/50">
                  <tr>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-sm sm:text-base 
                      font-black text-dashboard-text uppercase tracking-wide
                      border-r border-dashboard-accent/30
                    ">
                      <div className="flex items-center gap-2">
                        <Shield size={18} className="text-cyan-400" />
                        NOMBRE
                      </div>
                    </th>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-sm sm:text-base 
                      font-black text-dashboard-text uppercase tracking-wide
                      border-r border-dashboard-accent/30
                    ">
                      DESCRIPCIÓN
                    </th>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-sm sm:text-base 
                      font-black text-dashboard-text uppercase tracking-wide
                      border-r border-dashboard-accent/30
                    ">
                      ESTADO
                    </th>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-sm sm:text-base 
                      font-black text-dashboard-text uppercase tracking-wide
                    ">
                      ACCIONES
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashboard-accent/20">
                  {roles.map((role) => (
                    <tr 
                      key={role.id} 
                      className="
                        transition-all duration-300 
                        hover:bg-black hover:bg-opacity-80
                        group bg-dashboard-accent/5
                      "
                    >
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-sm sm:text-base 
                        text-dashboard-text font-semibold group-hover:text-white
                        transition-colors duration-300 border-r border-dashboard-accent/30
                      ">
                        <div className="flex items-center gap-2">
                          <Shield size={16} className="text-cyan-400 group-hover:text-cyan-300" />
                          {role.nombre}
                        </div>
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 text-sm sm:text-base 
                        text-dashboard-text-secondary group-hover:text-white
                        transition-colors duration-300 border-r border-dashboard-accent/30
                        max-w-xs
                      ">
                        <div className="line-clamp-2 group-hover:text-white">
                          {role.descripcion || (
                            <span className="text-dashboard-text-secondary/50 italic">
                              Sin descripción
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-sm sm:text-base 
                        border-r border-dashboard-accent/30
                      ">
                        <div className="group-hover:scale-105 transition-transform duration-300">
                          {formatStatus(role.estado)}
                        </div>
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-sm sm:text-base
                      ">
                        <RoleActions role={role} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {roles.length === 0 && !loading && (
            <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
              <div className="text-6xl mb-4">🛡️</div>
              <p className="text-dashboard-text text-xl font-black">No se encontraron roles</p>
              <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoleList;