// roshi_fit/src/pages/dashboard/subscriptions/SubscriptionActions.tsx
import React from 'react';
import { PlusCircle, XCircle, RefreshCw, History } from 'lucide-react';

interface Props {
  onExtend: () => void;
  onCancel: () => void;
  onRenew: () => void;
  onHistory: () => void;
}

const SubscriptionActions: React.FC<Props> = ({ onExtend, onCancel, onRenew, onHistory }) => {
  return (
    <div className="flex space-x-1 sm:space-x-2">
      <button
        onClick={onExtend}
        className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white border border-blue-600/30 hover:border-blue-400 transition-all duration-300 transform hover:scale-110"
        title="Extender Suscripción"
      >
        <PlusCircle size={16} />
      </button>
      <button
        onClick={onRenew}
        className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600 hover:text-white border border-green-600/30 hover:border-green-400 transition-all duration-300 transform hover:scale-110"
        title="Renovar Suscripción"
      >
        <RefreshCw size={16} />
      </button>
      <button
        onClick={onHistory}
        className="p-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600 hover:text-white border border-gray-600/30 hover:border-gray-400 transition-all duration-300 transform hover:scale-110"
        title="Ver Historial"
      >
        <History size={16} />
      </button>
      <button
        onClick={onCancel}
        className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white border border-red-600/30 hover:border-red-400 transition-all duration-300 transform hover:scale-110"
        title="Cancelar Suscripción"
      >
        <XCircle size={16} />
      </button>
    </div>
  );
};

export default SubscriptionActions;
