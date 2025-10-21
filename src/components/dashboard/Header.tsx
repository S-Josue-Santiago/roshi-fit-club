import React from 'react';
import { useDashboardTheme } from '../../contexts/DashboardThemeContext'; // ← Cambiado
import { Bell, LogOut, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ← Eliminado Link

const Header: React.FC = () => {
  const { theme, toggleTheme } = useDashboardTheme(); // ← Usa el contexto del dashboard
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
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 shadow-md bg-dashboard-bg border-b border-dashboard-accent">
      {/* Logo y Nombre */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-dashboard-primary rounded-full flex items-center justify-center">
          <span className="text-dashboard-bg font-bold text-sm">R</span>
        </div>
        <h1 className="text-xl font-bold text-dashboard-text">Roshi Fit</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-dashboard-text hover:text-dashboard-primary transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {user && (
          <span className="hidden md:inline text-dashboard-text font-medium">
            {user.nombre.split(' ')[0]}
          </span>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-dashboard-sidebar transition-colors"
          title={`Cambiar a tema ${isNocturno ? 'Amanecer' : 'Nocturno'}`}
        >
          {isNocturno ? <Sun size={20} className="text-dashboard-text" /> : <Moon size={20} className="text-dashboard-text" />}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 p-2 rounded-lg hover:bg-red-500/20 transition-colors text-dashboard-text"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
};

export default Header;