// roshi_fit/src/pages/dashboard/client/ClientDashboard.tsx
import React from 'react';
import ClientLayout from './ClientLayout';

const ClientDashboard: React.FC = () => {
  // En producción, aquí iría la lógica para obtener el estado real de la suscripción
  // Por ahora, simulamos con datos de localStorage

  return (
    <ClientLayout>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-dashboard-primary">
          Sección: Dashboard
        </h2>
        <p className="mt-2 text-dashboard-text-secondary">
          Bienvenido a tu panel de control.
        </p>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;           