// roshi_fit/src/pages/dashboard/subscriptions/SubscriptionActions.tsx
import React from 'react';

interface Props {
  onExtend: () => void;
  onCancel: () => void;
  onRenew: () => void;
  onHistory: () => void;
}

const SubscriptionActions: React.FC<Props> = ({ onExtend, onCancel, onRenew, onHistory }) => {
  return (
    <div className="flex gap-2">
      <button onClick={onExtend} className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded">Extender</button>
      <button onClick={onCancel} className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded">Cancelar</button>
      <button onClick={onRenew} className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white rounded">Renovar</button>
      <button onClick={onHistory} className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded">Historial</button>
    </div>
  );
};

export default SubscriptionActions;
