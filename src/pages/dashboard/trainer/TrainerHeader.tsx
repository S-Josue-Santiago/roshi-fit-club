// roshi_fit/src/pages/dashboard/trainer/TrainerHeader.tsx
import React from 'react';
import { useDashboardTheme } from '../../../contexts/DashboardThemeContext';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrainerHeader: React.FC = () => {
  const { theme, toggleTheme } = useDashboardTheme();
  const navigate = useNavigate();

  const userData = localStorage.getItem('userData');
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 shadow-md bg-dashboard-bg border-b border-dashboard-accent">
      {/* Logo y Nombre */}
      <div className="flex items-center space-x-3">
        <span className="text-2xl">🐉</span>
        <h1 className="text-xl font-bold text-dashboard-text">ROSHI FIT</h1>
      </div>

      {/* Información del usuario */}
      <div className="flex items-center space-x-6">
        {user && (
          <div className="hidden md:flex items-center space-x-3">
            <span className="text-dashboard-text font-medium">
              👤 {user.nombre.split(' ')[0]}
            </span>
          </div>
        )}

        {/* Cambio de tema */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-dashboard-sidebar transition-colors"
          title={`Cambiar a tema ${theme === 'nocturno' ? 'Amanecer' : 'Nocturno'}`}
        >
          {theme === 'nocturno' ? <Sun size={20} className="text-dashboard-text" /> : <Moon size={20} className="text-dashboard-text" />}
        </button>

        {/* Cerrar Sesión */}
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

export default TrainerHeader;