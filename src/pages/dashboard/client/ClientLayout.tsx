// roshi_fit/src/pages/dashboard/client/ClientDashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardThemeProvider } from '../../../contexts/DashboardThemeContext';
import ClientHeader from './ClientHeader';
import ClientSidebar from './ClientSidebar';
import ClientSubscription from './subscriptions/ClientSubscription';
import ProductList from './products/ProductList';
import ClientAccount from './account/ClientAccount';

const ClientDashboardLayoutContent: React.FC = () => {
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('activa');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (!data) {
      navigate('/');
      return;
    }

    try {
      const user = JSON.parse(data);
      setUserData(user);
      const status = user.subscriptionStatus || 'activa';
      setSubscriptionStatus(status);
    } catch (e) {
      navigate('/');
    }
  }, [navigate]);

  const handleAddToCart = () => {
    // Esta función es necesaria para ProductList.
    // Se puede usar para actualizar el contador del carrito en el futuro.
    console.log('Producto añadido al carrito');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'suscripcion':
        return <ClientSubscription />;
      case 'productos':
        return userData ? <ProductList usuarioId={userData.id} onAddToCart={handleAddToCart} /> : null;
      case 'cuenta':
        return <ClientAccount />;
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

const ClientDashboardLayout: React.FC = () => {
  return (
    <DashboardThemeProvider>
      <ClientDashboardLayoutContent />
    </DashboardThemeProvider>
  );
};

export default ClientDashboardLayout;