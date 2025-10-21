// roshi_fit/src/pages/dashboard/settings/SettingsLayout.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const settingsNav = [
  { id: 'general', name: 'General', path: '/dashboard/configuracion/general' },
  { id: 'email', name: 'Correo', path: '/dashboard/configuracion/email' },
  { id: 'pagos', name: 'Pagos', path: '/dashboard/configuracion/pagos' },
  { id: 'notificaciones', name: 'Notificaciones', path: '/dashboard/configuracion/notificaciones' },
  { id: 'seguridad', name: 'Seguridad', path: '/dashboard/configuracion/seguridad' },
];

const SettingsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dashboard-sidebar border-r border-dashboard-accent min-h-screen">
        <div className="p-6">
          <h2 className="text-xl font-bold text-dashboard-text mb-6">Configuración</h2>
          <nav className="space-y-2">
            {settingsNav.map(item => (
              <Link
                key={item.id}
                to={item.path}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-dashboard-primary text-dashboard-bg font-bold'
                    : 'text-dashboard-text hover:bg-dashboard-accent/30'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-6 bg-dashboard-bg text-dashboard-text">
        {children}
      </main>
    </div>
  );
};

export default SettingsLayout;