// roshi_fit/src/pages/dashboard/client/ClientDashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardThemeProvider, useDashboardTheme } from '../../../contexts/DashboardThemeContext';
import ClientHeader from './ClientHeader';
import ClientSidebar from './ClientSidebar';
import ClientSubscription from './subscriptions/ClientSubscription';

// Componente interno con lógica de layout
const ClientDashboardLayoutContent: React.FC = () => {
  const { theme } = useDashboardTheme();
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('activa');
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/');
      return;
    }

    try {
      const user = JSON.parse(userData);
      const status = user.subscriptionStatus || 'activa';
      setSubscriptionStatus(status);
    } catch (e) {
      navigate('/');
    }
  }, [navigate]);

  const renderContent = () => {
    switch (activeSection) {
      case 'suscripcion':
        return <ClientSubscription />;
      case 'productos':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold text-dashboard-primary">Sección: Productos</h2>
            <p className="mt-2 text-dashboard-text-secondary">Contenido de Productos.</p>
          </div>
        );
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
    <div className="min-h-screen bg-dashboard-bg text-dashboard-text">
      <ClientHeader subscriptionStatus={subscriptionStatus} />
      <ClientSidebar 
        subscriptionStatus={subscriptionStatus} 
        onSectionChange={setActiveSection} 
      />
      <main className="ml-64 pt-16 px-6 pb-8">
        {renderContent()}
      </main>
    </div>
  );
};

// Componente principal con proveedor de tema
const ClientDashboardLayout: React.FC = () => {
  return (
    <DashboardThemeProvider>
      <ClientDashboardLayoutContent />
    </DashboardThemeProvider>
  );
};

export default ClientDashboardLayout;