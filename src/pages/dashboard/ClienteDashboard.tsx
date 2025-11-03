// roshi_fit/src/pages/dashboard/ClienteDashboard.tsx
import React from 'react';
import ClientDashboardLayout from './client/ClientDashboardLayout';
import { Outlet } from 'react-router-dom'; // Importar Outlet

const ClienteDashboard: React.FC = () => {
  return (
    <ClientDashboardLayout>
      <Outlet /> {/* Aquí se renderizarán los componentes de ruta anidada */}
    </ClientDashboardLayout>
  );
};

export default ClienteDashboard;