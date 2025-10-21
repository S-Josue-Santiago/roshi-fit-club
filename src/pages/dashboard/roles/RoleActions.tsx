// roshi_fit/src/pages/dashboard/roles/RoleActions.tsx
import React from 'react';
import { Eye, Edit3, Power } from 'lucide-react';

interface RoleActionsProps {
  role: {
    id: number;
    estado: string;
  };
}

const RoleActions: React.FC<RoleActionsProps> = ({ role }) => {
  return (
    <div className="flex space-x-2">
      <button
        className="p-1 text-dashboard-text hover:text-dashboard-primary"
        title="Ver detalles"
      >
        <Eye size={16} />
      </button>
      <button
        className="p-1 text-dashboard-text hover:text-dashboard-primary"
        title="Editar"
      >
        <Edit3 size={16} />
      </button>
      <button
        className={`p-1 ${
          role.estado === 'activo'
            ? 'text-red-400 hover:text-red-300'
            : 'text-green-400 hover:text-green-300'
        }`}
        title={role.estado === 'activo' ? 'Desactivar' : 'Activar'}
      >
        <Power size={16} />
      </button>
    </div>
  );
};

export default RoleActions;