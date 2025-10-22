// roshi_fit/src/pages/dashboard/client/ClientLayout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardThemeProvider, useDashboardTheme } from '../../../contexts/DashboardThemeContext';
import ClientHeader from './ClientHeader';
import ClientSidebar from './ClientSidebar';

// ✅ Prop obligatorio
interface ClientLayoutProps {
  children: React.ReactNode;
  onSectionChange: (section: string) => void;
}

const ClientLayoutContent: React.FC<ClientLayoutProps> = ({ children, onSectionChange }) => {
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
      const status = user.subscriptionStatus || 'activa';
      setSubscriptionStatus(status);
    } catch (e) {
      console.error('Error al parsear userData:', e);
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-dashboard-bg text-dashboard-text">
      <ClientHeader subscriptionStatus={subscriptionStatus} />
      <ClientSidebar 
        subscriptionStatus={subscriptionStatus} 
        onSectionChange={onSectionChange} 
      />
      <main className="ml-64 pt-16 px-6 pb-8">
        {children}
      </main>
    </div>
  );
};

const ClientLayout: React.FC<ClientLayoutProps> = ({ children, onSectionChange }) => {
  return (
    <DashboardThemeProvider>
      <ClientLayoutContent onSectionChange={onSectionChange}>
        {children}
      </ClientLayoutContent>
    </DashboardThemeProvider>
  );
};

export default ClientLayout;