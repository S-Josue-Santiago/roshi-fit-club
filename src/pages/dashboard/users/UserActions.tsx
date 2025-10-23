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
    <div className="flex space-x-1 sm:space-x-2">
      {/* Botón Ver */}
      <button
        onClick={() => onView(user.id)}
        className="
          p-2 sm:p-2 bg-cyan-600/20 text-cyan-400 rounded-lg
          hover:bg-cyan-600 hover:text-white
          border border-cyan-600/30 hover:border-cyan-400
          transition-all duration-300 transform hover:scale-110
          group relative
        "
        title="Ver perfil"
      >
        <Eye size={16} className="sm:w-4 sm:h-4" />
        {/* Tooltip */}

      </button>

      {/* Botón Editar */}
      <button
        onClick={() => onEdit(user.id)}
        className="
          p-2 sm:p-2 bg-blue-600/20 text-blue-400 rounded-lg
          hover:bg-blue-600 hover:text-white
          border border-blue-600/30 hover:border-blue-400
          transition-all duration-300 transform hover:scale-110
          group relative
        "
        title="Editar usuario"
      >
        <Edit3 size={16} className="sm:w-4 sm:h-4" />

      </button>

      {/* Botón Restablecer Contraseña */}
      <button
        onClick={() => onResetPassword(user.id)}
        className="
          p-2 sm:p-2 bg-purple-600/20 text-purple-400 rounded-lg
          hover:bg-purple-600 hover:text-white
          border border-purple-600/30 hover:border-purple-400
          transition-all duration-300 transform hover:scale-110
          group relative
        "
        title="Restablecer contraseña"
      >
        <Lock size={16} className="sm:w-4 sm:h-4" />
        {/* Tooltip */}

      </button>

      {/* Botón Activar/Desactivar */}
      <button
        onClick={() => onToggleStatus(user.id, user.estado)}
        className={`
          p-2 sm:p-2 rounded-lg border transition-all duration-300 transform hover:scale-110
          group relative
          ${
            user.estado === 'activo'
              ? 'bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600 hover:text-white hover:border-red-400'
              : 'bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600 hover:text-white hover:border-green-400'
          }
        `}
        title={user.estado === 'activo' ? 'Desactivar usuario' : 'Activar usuario'}
      >
        <Power size={16} className="sm:w-4 sm:h-4" />

      </button>
    </div>
  );
};

export default UserActions;