import React from 'react';
import { useDashboardTheme } from '../../contexts/DashboardThemeContext';
import { Bell, LogOut, Sun, Moon, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useDashboardTheme();
  const navigate = useNavigate();

  const userData = localStorage.getItem('userData');
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const isNocturno = theme === 'nocturno';

  return (
    <header className="
      fixed top-0 left-0 right-0 z-50 h-16 
      flex items-center justify-between px-6 
      bg-dashboard-bg border-b border-dashboard-accent/50
      shadow-lg backdrop-blur-sm
    ">
      {/* Logo y Nombre - Mejorado */}
      <div className="flex items-center space-x-3">
        <div className="
          w-10 h-10 bg-gradient-to-br from-dashboard-primary to-dashboard-primary/80 
          rounded-xl flex items-center justify-center shadow-lg
          transform hover:scale-105 transition-transform duration-300
        ">
          <span className="text-dashboard-bg font-black text-lg">R</span>
        </div>
        <div>
          <h1 className="text-xl font-black text-dashboard-text tracking-tight">
            Roshi Fit
          </h1>
          <p className="text-xs text-dashboard-text-secondary font-medium">
            Dashboard
          </p>
        </div>
      </div>

      {/* Controles derecho - Mejorado */}
      <div className="flex items-center space-x-3">
        {/* Botón de notificaciones */}
        <button className="
          relative p-3 rounded-xl 
          bg-dashboard-sidebar/50 hover:bg-dashboard-sidebar
          text-dashboard-text hover:text-dashboard-primary
          transition-all duration-300 transform hover:scale-110
          border border-dashboard-accent/30
        ">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* Información del usuario */}
        {user && (
          <div className="
            hidden md:flex items-center space-x-2 
            px-4 py-2 rounded-xl
            bg-dashboard-sidebar/30 border border-dashboard-accent/20
          ">
            <User size={16} className="text-dashboard-primary" />
            <span className="text-dashboard-text font-semibold text-sm">
              {user.nombre.split(' ')[0]}
            </span>
          </div>
        )}

        {/* Toggle de tema - Mejorado */}
        <button
          onClick={toggleTheme}
          className="
            p-3 rounded-xl 
            bg-dashboard-sidebar/50 hover:bg-dashboard-sidebar
            border border-dashboard-accent/30
            transition-all duration-300 transform hover:scale-110
            group
          "
          title={`Cambiar a tema ${isNocturno ? 'Amanecer' : 'Nocturno'}`}
        >
          {isNocturno ? (
            <Sun size={20} className="text-dashboard-text group-hover:text-yellow-400 transition-colors" />
          ) : (
            <Moon size={20} className="text-dashboard-text group-hover:text-indigo-300 transition-colors" />
          )}
        </button>

        {/* Botón de logout - Mejorado */}
        <button
          onClick={handleLogout}
          className="
            flex items-center space-x-2 px-4 py-3 
            rounded-xl font-semibold
            bg-red-500/10 hover:bg-red-500/20 
            border border-red-500/30 hover:border-red-500/50
            text-red-400 hover:text-red-300
            transition-all duration-300 transform hover:scale-105
            group
          "
        >
          <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline text-sm">Salir</span>
        </button>
      </div>
    </header>
  );
};

export default Header;