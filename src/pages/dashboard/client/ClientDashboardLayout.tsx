// roshi_fit/src/pages/dashboard/client/ClientDashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardThemeProvider } from '../../../contexts/DashboardThemeContext';
import ClientHeader from './ClientHeader';
import ClientHorizontalNavbar from './ClientHorizontalNavbar'; // Importar nueva navbar horizontal
import { ClientProvider } from '../../../contexts/ClientContext'; // Importar ClientProvider


interface ClientDashboardLayoutContentProps {
  children: React.ReactNode;
}

const ClientDashboardLayoutContent: React.FC<ClientDashboardLayoutContentProps> = ({ children }) => {
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('activa');
  // const [activeSection, setActiveSection] = useState('dashboard'); // Eliminado
  const [userData, setUserData] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para controlar el menú móvil

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
    // Recargar carrito o mostrar notificación
    console.log('Producto añadido al carrito');
  };

  // Eliminar renderContent, ahora el Outlet lo maneja
  // const renderContent = () => {
  //   switch (activeSection) {
  //     case 'suscripcion':
  //       return <ClientSubscription />;
  //     case 'productos':
  //       return userData ? <ProductList usuarioId={userData.id} onAddToCart={handleAddToCart} /> : null;
  //     case 'ejercicios':
  //       return <ClientExerciseList />;
  //     case 'cuenta':
  //       return <ClientAccount />;
  //     case 'entrenamientos':
  //        return <MyTraining />;
  //      default:
  //        return (
  //          <div className="p-4">
  //            <h2 className="text-2xl font-bold text-dashboard-primary">Sección: Dashboard</h2>
  //            <p className="mt-2 text-dashboard-text-secondary">
  //              Bienvenido a tu panel de control.
  //            </p>
  //          </div>
  //        );
  //    }
  // };

  return (
    <div className="min-h-screen bg-dashboard-bg text-dashboard-text">
      <ClientHeader 
        subscriptionStatus={subscriptionStatus} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <ClientHorizontalNavbar
        subscriptionStatus={subscriptionStatus}
        // activeSection={activeSection} // Eliminado
        // onSectionChange={setActiveSection} // Eliminado
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      {/* <ClientSidebar 
        subscriptionStatus={subscriptionStatus} 
        onSectionChange={setActiveSection} 
      /> */}
      <main className="pt-16 lg:pt-32 px-6 pb-8"> {/* Ajustar padding superior */}
        {/* Envuelve children con ClientProvider para pasar el contexto */}
        <ClientProvider usuarioId={userData?.id || null} onAddToCart={handleAddToCart}>
          {children} {/* Renderizar contenido desde Outlet */}
        </ClientProvider>
      </main>

      {/* Overlay para cerrar el menú móvil */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

const ClientDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DashboardThemeProvider>
      <ClientDashboardLayoutContent>
        {children}
      </ClientDashboardLayoutContent>
    </DashboardThemeProvider>
  );
};

export default ClientDashboardLayout;