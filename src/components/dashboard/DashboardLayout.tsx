// roshi_fit/src/components/dashboard/DashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import UserList from '../../pages/dashboard/users/UserList'; // ← Nuevo
import RoleList from '../../pages/dashboard/roles/RoleList';
import ProductList from '../../pages/dashboard/products/ProductList';
import SupplierList from '../../pages/dashboard/suppliers/SupplierList';
import CategoryList from '../../pages/dashboard/categories/CategoryList';
import ExerciseList from '../../pages/dashboard/exercises/ExerciseList';
import ServiceList from '../../pages/dashboard/services/ServiceList';
import GalleryList from '../../pages/dashboard/gallery/GalleryList'
import SubscriptionsList from '../../pages/dashboard/subscriptions/SubscriptionsList';
import PlansList from '../../pages/dashboard/subscriptions/PlansList';
import SalesList from '../../pages/dashboard/sales/SalesList';
import EquipmentList from '../../pages/dashboard/equipments/EquipmentList';
import ReportList from '../../pages/dashboard/reports/ReportList';





const DashboardLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('usuarios');
  const [isCollapsed, setIsCollapsed] = useState(false); // Moved from Sidebar

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

  const renderContent = () => {
    switch (activeSection) {
      case 'usuarios':
        return <UserList />;
      

      case 'roles':
        return <RoleList />;

      case 'productos':
        return <ProductList />;

      case 'proveedores':
        return <SupplierList />;

      case 'categorias':
        return <CategoryList />;

      case 'ejercicios':
        return <ExerciseList />;

      case 'servicios':
        return <ServiceList />;

      case 'galeria':
        return <GalleryList />;

      case 'equipos':
        return <EquipmentList />;



      case 'suscripciones':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-dashboard-text mb-3">Planes de Suscripción</h2>
              <PlansList />
            </div>
            <div>
              <h2 className="text-xl font-bold text-dashboard-text mb-3">Suscripciones de Usuarios</h2>
              <SubscriptionsList />
            </div>
          </div>
        );


      case 'reportes':
        return <ReportList />;




      default:
        if (activeSection === 'ventas') return <SalesList />;
        return <h2 className="text-2xl font-bold text-dashboard-primary">Sección: {activeSection.toUpperCase()}</h2>;
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-bg text-dashboard-text">
      <Header />
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <main className={`transition-all duration-300 pt-24 px-6 pb-8 ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardLayout;