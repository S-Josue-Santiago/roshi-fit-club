// roshi_fit/src/pages/dashboard/users/UserList.tsx
import React, { useState, useEffect } from 'react';
import { type User } from '../../../types/User';
import { fetchUsers, updateUser } from '../../../api/userApi';
import UserFilters from './UserFilters';
import UserActions from './UserActions';
import UserEditModal from './UserEditModal';
import ResetPasswordModal from './ResetPasswordModal';
import CreateUserModal from './CreateUserModal';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    tipo_usuario: '',
    estado: '',
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resettingUserId, setResettingUserId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers(filters);
      setUsers(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const handleAddUser = () => {
    setIsCreateModalOpen(true);
  };

  const handleView = (id: number) => {
    alert(`Ver perfil del usuario ${id}`);
  };

  const handleEdit = (id: number) => {
    const user = users.find(u => u.id === id);
    if (user) setEditingUser(user);
  };

  const handleResetPassword = (id: number) => {
    setResettingUserId(id);
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'activo' ? 'inactivo' : 'activo';
    try {
      await updateUser(id, { estado: newStatus });
      loadUsers();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const formatStatus = (estado: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      activo: { text: '✅ Activo', color: 'text-green-600 font-bold' },
      inactivo: { text: '⏸️ Inactivo', color: 'text-yellow-600 font-bold' },
      desabilitado: { text: '❌ Deshabilitado', color: 'text-red-600 font-bold' },
    };
    return statusMap[estado] || { text: estado, color: 'text-gray-600 font-bold' };
  };

  return (
    <div className="
      bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent
      shadow-lg hover:shadow-xl transition-all duration-300
      mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 // Added responsive spacing
    ">
      <UserFilters
        filters={filters}
        onFilterChange={setFilters}
        onAddUser={handleAddUser}
      />

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
                      NOMBRE
                    </th>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-sm sm:text-base 
                      font-black text-dashboard-text uppercase tracking-wide
                      border-r border-dashboard-accent/30
                    ">
                      EMAIL
                    </th>
                    <th scope="col" className="
                      px-3 py-3 sm:px-4 sm:py-4 text-left text-sm sm:text-base 
                      font-black text-dashboard-text uppercase tracking-wide
                      border-r border-dashboard-accent/30
                    ">
                      ROL
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
                  {users.map((user) => (
                    <tr 
                      key={user.id} 
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
                        {user.nombre_completo}
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-sm sm:text-base 
                        text-dashboard-text font-medium group-hover:text-white
                        transition-colors duration-300 border-r border-dashboard-accent/30
                      ">
                        {user.email}
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-sm sm:text-base 
                        text-dashboard-text font-medium capitalize group-hover:text-white
                        transition-colors duration-300 border-r border-dashboard-accent/30
                      ">
                        {user.tipo_usuario}
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-sm sm:text-base 
                        border-r border-dashboard-accent/30 font-semibold
                      ">
                        <span className={`
                          ${formatStatus(user.estado).color} 
                          group-hover:text-white
                          transition-colors duration-300
                        `}>
                          {formatStatus(user.estado).text}
                        </span>
                      </td>
                      <td className="
                        px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-sm sm:text-base 
                      ">
                        <UserActions
                          user={user}
                          onView={handleView}
                          onEdit={handleEdit}
                          onToggleStatus={handleToggleStatus}
                          onResetPassword={handleResetPassword}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {users.length === 0 && !loading && (
            <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-dashboard-text text-xl font-black">No se encontraron usuarios</p>
              <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal de Edición */}
      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={loadUsers}
        />
      )}

      {/* Modal de contraseña */}
      {resettingUserId && (
        <ResetPasswordModal
          userId={resettingUserId}
          onClose={() => setResettingUserId(null)}
          onPasswordReset={loadUsers}
        />
      )}

      {isCreateModalOpen && (
        <CreateUserModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreateSuccess={loadUsers}
        />
      )}
    </div>
  );
};

export default UserList;