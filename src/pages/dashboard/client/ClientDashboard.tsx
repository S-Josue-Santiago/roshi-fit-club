// roshi_fit/src/pages/dashboard/ClienteDashboard.tsx
import React, { useState, useEffect } from 'react';
import ClientLayout from './ClientLayout';
import ClientSubscription from './subscriptions/ClientSubscription';
import ClientDashboardLayout from './ClientDashboardLayout';

const ClienteDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
const ClienteDashboard: React.FC = () => {
  return <ClientDashboardLayout />;
};

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (!user.subscriptionStatus) {
          const updatedUser = { ...user, subscriptionStatus: 'activa' };
          localStorage.setItem('userData', JSON.stringify(updatedUser));
        }
      } catch (e) {
        console.error('Error al leer userData:', e);
      }
    }
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'suscripcion':
        return <ClientSubscription />;


    


      case 'cuenta':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold text-dashboard-primary">Sección: Cuenta</h2>
            <p className="mt-2 text-dashboard-text-secondary">Configuración de Cuenta.</p>
          </div>
        );
      default:
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold text-dashboard-primary">Sección: Dashboard</h2>
            <p className="mt-2 text-dashboard-text-secondary">
              Bienvenido a tu panel de control.
            </p>
          </div>
        );
    }
  };

  return (
    <ClientLayout onSectionChange={setActiveSection}>
      {renderContent()}
    </ClientLayout>
  );
};

export default ClienteDashboard;