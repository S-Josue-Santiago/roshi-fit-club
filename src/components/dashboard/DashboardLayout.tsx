// roshi_fit/src/components/dashboard/DashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode; // Para renderizar el <Outlet />
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // const location = useLocation(); // Keep useLocation for sidebar active state calculation
  const [isCollapsed, setIsCollapsed] = useState(false);
  // const [activeSection, setActiveSection] = useState<string>('usuarios'); // Estado para la sección activa

  // Manejar el cambio de sección
  // const handleSectionChange = (section: string) => {
  //   setActiveSection(section);
  // };

  // Efecto para establecer la sección activa inicial basada en la URL al montar el componente
  // useEffect(() => {
  //   const path = location.pathname;
  //   // Si la ruta es específicamente para configuración, no cambiamos la activeSection principal
  //   if (path.includes('/dashboard/admin/settings')) {
  //     setActiveSection('configuracion');
  //   } else if (path.includes('/dashboard/admin/usuarios')) {
  //     setActiveSection('usuarios');
  //   } else if (path.includes('/dashboard/admin/roles')) {
  //     setActiveSection('roles');
  //   } else if (path.includes('/dashboard/admin/productos')) {
  //     setActiveSection('productos');
  //   } else if (path.includes('/dashboard/admin/proveedores')) {
  //     setActiveSection('proveedores');
  //   } else if (path.includes('/dashboard/admin/categorias')) {
  //     setActiveSection('categorias');
  //   } else if (path.includes('/dashboard/admin/ejercicios')) {
  //     setActiveSection('ejercicios');
  //   } else if (path.includes('/dashboard/admin/servicios')) {
  //     setActiveSection('servicios');
  //   } else if (path.includes('/dashboard/admin/galeria')) {
  //     setActiveSection('galeria');
  //   } else if (path.includes('/dashboard/admin/equipos')) {
  //     setActiveSection('equipos');
  //   } else if (path.includes('/dashboard/admin/suscripciones')) { // Ajuste para suscripciones
  //     setActiveSection('suscripciones');
  //   } else if (path.includes('/dashboard/admin/ventas')) {
  //     setActiveSection('ventas');
  //   } else if (path.includes('/dashboard/admin/reportes')) {
  //     setActiveSection('reportes');
  //   } else {
  //     setActiveSection('usuarios'); // Por defecto, mostrar usuarios
  //   }
  // }, [location.pathname]);

  // Handle window resize to adjust sidebar state (Moved from Sidebar)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // Equivalent to 'lg' breakpoint in Tailwind CSS
        setIsCollapsed(false); // Ensure it's uncollapsed on desktop
      } else {
        setIsCollapsed(true); // Always collapsed on mobile by default
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount to set initial state

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // No longer needed, as React Router handles content rendering via Outlet
  // const renderContent = () => {
  //   switch (activeSection) {
  //     case 'usuarios':
  //       return <UserList />;
  //     case 'roles':
  //       return <RoleList />;
  //     case 'productos':
  //       return <ProductList />;
  //     case 'proveedores':
  //       return <SupplierList />;
  //     case 'categorias':
  //       return <CategoryList />;
  //     case 'ejercicios':
  //       return <ExerciseList />;
  //     case 'servicios':
  //       return <ServiceList />;
  //     case 'galeria':
  //       return <GalleryList />;
  //     case 'suscripciones':
  //       return <SubscriptionsLayout />;
  //     case 'ventas':
  //       return <SalesList />;
  //     case 'equipos':
  //       return <EquipmentList />;
  //     case 'reportes':
  //       return <ReportList />;
  //     case 'configuracion':
  //       return <SettingsLayout />;
  //     default:
  //       return <UserList />;
  //   }
  // };

  return (
    <div className="min-h-screen bg-dashboard-bg text-dashboard-text">
      <Header />
      <Sidebar 
        // activeSection={activeSection} // No longer needed
        // onSectionChange={handleSectionChange} // No longer needed
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <main className={`transition-all duration-300 pt-24 px-6 pb-8 ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        {children} {/* Renderizar las rutas anidadas aquí, provenientes de AdminDashboard's Outlet */}
      </main>
    </div>
  );
};

export default DashboardLayout;