// roshi_fit/src/pages/dashboard/client/ClientLayout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardThemeProvider, useDashboardTheme } from '../../../contexts/DashboardThemeContext';
import ClientHeader from './ClientHeader';
import ClientSidebar from './ClientSidebar';

interface ClientLayoutProps {
  children: React.ReactNode;
}

// Componente interno con acceso al contexto
const ClientLayoutContent: React.FC<ClientLayoutProps> = ({ children }) => {
  const { theme } = useDashboardTheme();
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('activa');

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/');
      return;
    }

    try {
      const user = JSON.parse(userData);
      // Simulamos el estado de suscripción (en producción, vendría del backend)
      const status = user.subscriptionStatus || 'activa';
      setSubscriptionStatus(status);
    } catch (e) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-dashboard-bg text-dashboard-text">
      <ClientHeader subscriptionStatus={subscriptionStatus} />
      <ClientSidebar subscriptionStatus={subscriptionStatus} />
      <main className="ml-64 pt-16 px-6 pb-8">
        {children}
      </main>
    </div>
  );
};

// Componente principal con proveedor de tema
const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <DashboardThemeProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </DashboardThemeProvider>
  );
};

export default ClientLayout;