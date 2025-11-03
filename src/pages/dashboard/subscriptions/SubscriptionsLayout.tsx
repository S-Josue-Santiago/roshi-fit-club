import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const SubscriptionsLayout: React.FC = () => {
  const location = useLocation();

  const isLinkActive = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="bg-dashboard-card p-6 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-[1.005]">
      <div className="border-b border-dashboard-border pb-4 mb-6 flex space-x-4">
        <Link
          to="listado"
          className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300
            ${isLinkActive('/dashboard/admin/suscripciones/listado') ? 'bg-dashboard-primary text-white shadow-md' : 'text-dashboard-text-secondary hover:bg-dashboard-hover'}`}
        >
          Listado de Suscripciones
        </Link>
        <Link
          to="planes"
          className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300
            ${isLinkActive('/dashboard/admin/suscripciones/planes') ? 'bg-dashboard-primary text-white shadow-md' : 'text-dashboard-text-secondary hover:bg-dashboard-hover'}`}
        >
          Planes
        </Link>
      </div>
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
};

export default SubscriptionsLayout;
