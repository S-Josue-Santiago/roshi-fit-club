import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const SettingsLayout: React.FC = () => {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    return `py-2 px-4 rounded-lg text-lg font-semibold transition-colors duration-200
      ${location.pathname.includes(path) ? 'bg-dashboard-primary text-white shadow-md' : 'text-dashboard-text-secondary hover:bg-dashboard-accent/30'}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-black text-dashboard-text mb-8">Ajustes del Sistema</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar de Ajustes */}
        <nav className="flex flex-col space-y-3 p-4 bg-dashboard-widget/50 rounded-xl border border-dashboard-accent/50 shadow-md md:w-64 flex-shrink-0">
          <Link to="general" className={getLinkClass('general')}>
            Ajustes Generales
          </Link>
          <Link to="site-content" className={getLinkClass('site-content')}>
            Contenido del Sitio
          </Link>
          {/* Agrega más enlaces para otras subsecciones de ajustes aquí */}
        </nav>

        {/* Contenido de Ajustes */}
        <div className="flex-grow bg-dashboard-widget/50 p-6 rounded-xl border border-dashboard-accent/50 shadow-md">
          <Outlet /> {/* Aquí se renderizarán los componentes de subsección */}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
