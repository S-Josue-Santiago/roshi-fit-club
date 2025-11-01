// roshi_fit/src/pages/dashboard/roles/RoleActions.tsx
import React from 'react';
import {  Edit3, Power } from 'lucide-react';

interface RoleActionsProps {
  role: {
    id: number;
    estado: string;
  };
}

const RoleActions: React.FC<RoleActionsProps> = ({ role }) => {
  return (
    <div className="flex space-x-1 sm:space-x-2">


      {/* Botón Editar */}
      <button
        className="
          p-2 sm:p-2 bg-cyan-600/20 text-cyan-400 rounded-lg
          hover:bg-cyan-600 hover:text-white
          border border-cyan-600/30 hover:border-cyan-400
          transition-all duration-300 transform hover:scale-110
          group relative
        "
        title="Editar rol"
      >
        <Edit3 size={16} className="sm:w-4 sm:h-4" />

      </button>

      {/* Botón Activar/Desactivar */}
      <button
        className={`
          p-2 sm:p-2 rounded-lg border transition-all duration-300 transform hover:scale-110
          group relative
          ${
            role.estado === 'activo'
              ? 'bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600 hover:text-white hover:border-red-400'
              : 'bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600 hover:text-white hover:border-green-400'
          }
        `}
        title={role.estado === 'activo' ? 'Desactivar rol' : 'Activar rol'}
      >
        <Power size={16} className="sm:w-4 sm:h-4" />

      </button>
    </div>
  );
};

export default RoleActions;