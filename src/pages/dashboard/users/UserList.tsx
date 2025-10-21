// roshi_fit/src/pages/dashboard/users/UserList.tsx
import React, { useState, useEffect } from 'react';
import { type  User } from '../../../types/User'; // , type UserFilters as UserFilterState
import { fetchUsers,  updateUser } from '../../../api/userApi'; // resetUserPassword,
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
  // para cambiar contras
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
  // para cambiar contrasenia
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
      activo: { text: '✅ Activo', color: 'text-green-400' },
      inactivo: { text: '⏸️ Inactivo', color: 'text-yellow-400' },
      desabilitado: { text: '❌ Deshabilitado', color: 'text-red-400' },
    };
    return statusMap[estado] || { text: estado, color: 'text-gray-400' };
  };

  return (
    <div className="bg-dashboard-accent/30 p-6 rounded-xl border border-dashboard-accent">
      <UserFilters
        filters={filters}
        onFilterChange={setFilters}
        onAddUser={handleAddUser}
      />

      {loading ? (
        <p className="text-dashboard-text">Cargando usuarios...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-dashboard-text">
            <thead>
              <tr className="border-b border-dashboard-accent">
                <th className="py-3 px-4 text-left">NOMBRE</th>
                <th className="py-3 px-4 text-left">EMAIL</th>
                <th className="py-3 px-4 text-left">ROL</th>
                <th className="py-3 px-4 text-left">ESTADO</th>
                <th className="py-3 px-4 text-left">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-dashboard-accent/50 hover:bg-dashboard-accent/20">
                  <td className="py-3 px-4">{user.nombre_completo}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4 capitalize">{user.tipo_usuario}</td>
                  <td className="py-3 px-4">
                    <span className={formatStatus(user.estado).color}>
                      {formatStatus(user.estado).text}
                    </span>
                  </td>
                  <td className="py-3 px-4">
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

          {users.length === 0 && !loading && (
            <p className="text-dashboard-text text-center py-6">No se encontraron usuarios.</p>
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

                {/* Modal de contrasenia */}
      {resettingUserId && (
        <ResetPasswordModal
          userId={resettingUserId}
          onClose={() => setResettingUserId(null)}
          onPasswordReset={loadUsers} // Opcional: recarga lista si es necesario
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