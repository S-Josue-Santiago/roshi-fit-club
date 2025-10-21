// roshi_fit/src/pages/dashboard/users/UserActions.tsx
import React from 'react';
import { Eye, Edit3, Lock, Power } from 'lucide-react';

interface UserActionsProps {
  user: {
    id: number;
    estado: string;
  };
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onToggleStatus: (id: number, currentStatus: string) => void;
  onResetPassword: (id: number) => void;
}

const UserActions: React.FC<UserActionsProps> = ({
  user,
  onView,
  onEdit,
  onToggleStatus,
  onResetPassword,
}) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onView(user.id)}
        className="p-1 text-dashboard-text hover:text-dashboard-primary"
        title="Ver perfil"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={() => onEdit(user.id)}
        className="p-1 text-dashboard-text hover:text-dashboard-primary"
        title="Editar"
      >
        <Edit3 size={16} />
      </button>
      <button
        onClick={() => onResetPassword(user.id)}
        className="p-1 text-dashboard-text hover:text-dashboard-secondary"
        title="Restablecer contraseña"
      >
        <Lock size={16} />
      </button>
      <button
        onClick={() => onToggleStatus(user.id, user.estado)}
        className={`p-1 ${
          user.estado === 'activo'
            ? 'text-red-400 hover:text-red-300'
            : 'text-green-400 hover:text-green-300'
        }`}
        title={user.estado === 'activo' ? 'Desactivar' : 'Activar'}
      >
        <Power size={16} />
      </button>
    </div>
  );
};

export default UserActions;