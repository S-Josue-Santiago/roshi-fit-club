// roshi_fit/src/pages/dashboard/AdminDashboard.tsx
import React from 'react';
import { DashboardThemeProvider } from '../../contexts/DashboardThemeContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { Outlet } from 'react-router-dom'; // Importar Outlet

const AdminDashboard: React.FC = () => {
  return (
    <DashboardThemeProvider>
      <DashboardLayout>
        <Outlet /> {/* Aquí se renderizarán los componentes de ruta anidada */}
      </DashboardLayout>
    </DashboardThemeProvider>
  );
};

export default AdminDashboard;