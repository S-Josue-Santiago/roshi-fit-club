// roshi_fit/src/pages/dashboard/client/ClientDashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardThemeProvider } from '../../../contexts/DashboardThemeContext';
import ClientHeader from './ClientHeader';
import { getCart } from '../../../api/purchaseApi'; // Importar getCart
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
  const [cartCount, setCartCount] = useState(0); // 1. Estado del contador del carrito

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

      // Cargar el contador inicial del carrito
      if (user.id) {
        getCart(user.id).then(cart => {
          setCartCount(cart.items.reduce((sum, item) => sum + item.cantidad, 0));
        }).catch(err => console.error("Error al cargar carrito inicial:", err));
      }
    } catch (e) {
      navigate('/');
    }
  }, [navigate]);

  // 2. Función para recargar el contador del carrito
  const refetchCartCount = async () => {
    if (userData?.id) {
      try {
        const cart = await getCart(userData.id);
        const count = cart.items.reduce((sum, item) => sum + item.cantidad, 0);
        setCartCount(count);
      } catch (error) {
        console.error('Error al recargar el contador del carrito:', error);
        setCartCount(0); // Resetear en caso de error
      }
    }
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
        cartCount={cartCount} // 3. Pasar el contador al Header
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
        <ClientProvider usuarioId={userData?.id || null} onAddToCart={refetchCartCount}>
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