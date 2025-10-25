import React, { useEffect, useState } from 'react';
import { useDashboardTheme } from '../../contexts/DashboardThemeContext';
import { Bell, LogOut, Sun, Moon, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Hook para detectar el tema del dashboard
const useDashboardThemeDetection = () => {
  const [detectedTheme, setDetectedTheme] = useState<'nocturno' | 'amanecer'>('nocturno');

  useEffect(() => {
    const checkTheme = () => {
      const bodyClass = document.body.className;
      if (bodyClass.includes('theme-dashboard-amanecer')) {
        setDetectedTheme('amanecer');
      } else {
        setDetectedTheme('nocturno');
      }
    };

    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return detectedTheme;
};

const Header: React.FC = () => {
  const { theme, toggleTheme } = useDashboardTheme();
  const detectedTheme = useDashboardThemeDetection();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userData = localStorage.getItem('userData');
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const isNocturno = detectedTheme === 'nocturno';

  // Estilos según tema
  const getStyles = () => {
    if (detectedTheme === 'amanecer') {
      return {
        header: 'bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100 border-slate-300',
        headerShadow: '0 4px 20px rgba(74, 144, 226, 0.15)',
        logo: 'bg-gradient-to-br from-blue-500 to-purple-600',
        logoText: 'text-white',
        title: 'text-gray-900',
        subtitle: 'text-gray-600',
        button: {
          base: 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-slate-300 hover:border-blue-400',
          text: 'text-gray-700 hover:text-blue-600',
          icon: 'text-gray-600'
        },
        notificationBadge: 'bg-red-500',
        userCard: 'bg-white border-slate-300',
        userIcon: 'text-blue-500',
        userName: 'text-gray-900',
        themeIcon: 'text-gray-700 group-hover:text-blue-600',
        logoutButton: {
          base: 'bg-red-50 hover:bg-red-100 border-red-300 hover:border-red-400',
          text: 'text-red-600 hover:text-red-700'
        }
      };
    }
    
    // Tema Nocturno
    return {
      header: 'bg-gradient-to-r from-[#0A0E27] via-[#16213E] to-[#0A0E27] border-[#16213E]',
      headerShadow: '0 4px 20px rgba(138, 43, 226, 0.2)',
      logo: 'bg-gradient-to-br from-purple-900 to-purple-700',
      logoText: 'text-white',
      title: 'text-white',
      subtitle: 'text-[#B0BEC5]',
      button: {
        base: 'bg-[#16213E]/50 hover:bg-[#16213E] border-purple-500/30 hover:border-purple-500',
        text: 'text-white hover:text-[#FFD700]',
        icon: 'text-[#B0BEC5]'
      },
      notificationBadge: 'bg-red-500',
      userCard: 'bg-[#16213E]/50 border-purple-500/20',
      userIcon: 'text-[#FFD700]',
      userName: 'text-white',
      themeIcon: 'text-white group-hover:text-[#FFD700]',
      logoutButton: {
        base: 'bg-red-900/20 hover:bg-red-900/40 border-red-500/40 hover:border-red-500/60',
        text: 'text-red-400 hover:text-red-300'
      }
    };
  };

  const styles = getStyles();

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 h-16 
        flex items-center justify-between px-4 md:px-6 
        ${styles.header} border-b-2
        backdrop-blur-xl
      `}
      style={{ boxShadow: styles.headerShadow }}
    >
      {/* Logo y Nombre - Mejorado */}
      <div className="flex items-center space-x-3">
        <div 
          className={`
            w-10 h-10 md:w-12 md:h-12 ${styles.logo}
            rounded-2xl flex items-center justify-center shadow-xl
            transform hover:scale-110 transition-all duration-300 hover:rotate-6
          `}
        >
          <span className={`${styles.logoText} font-black text-lg md:text-xl`}>R</span>
        </div>
        <div className="hidden sm:block">
          <h1 className={`text-lg md:text-xl font-black ${styles.title} tracking-tight`}>
            Roshi Fit
          </h1>
          <p className={`text-xs ${styles.subtitle} font-semibold`}>
            Dashboard Admin
          </p>
        </div>
      </div>

      {/* Controles derecho - Mejorado */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Botón de notificaciones */}
        <button 
          className={`
            relative p-2.5 md:p-3 rounded-xl 
            ${styles.button.base}
            transition-all duration-300 transform hover:scale-110
            border-2 shadow-md hover:shadow-lg
          `}
          title="Notificaciones"
        >
          <Bell size={20} className={styles.button.icon} />
          <span className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 ${styles.notificationBadge} rounded-full animate-pulse shadow-lg`}></span>
        </button>

        {/* Información del usuario - Mejorado */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`
                flex items-center space-x-2 md:space-x-3
                px-3 md:px-4 py-2 md:py-2.5 rounded-xl
                ${styles.userCard} border-2
                transition-all duration-300 transform hover:scale-105
                shadow-md hover:shadow-lg group
              `}
            >
              <div className={`w-8 h-8 ${styles.logo} rounded-lg flex items-center justify-center shadow-md`}>
                <User size={16} className="text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className={`${styles.userName} font-bold text-sm leading-tight`}>
                  {user.nombre.split(' ')[0]}
                </p>
                <p className={`${styles.subtitle} text-xs font-medium`}>
                  {user.tipo || 'Usuario'}
                </p>
              </div>
              <ChevronDown 
                size={16} 
                className={`${styles.button.text} transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* Menú desplegable del usuario */}
            {showUserMenu && (
              <div 
                className={`
                  absolute top-full right-0 mt-2 w-48
                  ${styles.userCard} border-2
                  rounded-xl shadow-xl overflow-hidden
                  transform transition-all duration-300
                  animate-fadeIn
                `}
              >
                <div className="p-3 border-b" style={{ borderColor: detectedTheme === 'amanecer' ? '#CBD5E1' : '#16213E' }}>
                  <p className={`${styles.userName} font-bold text-sm`}>{user.nombre}</p>
                  <p className={`${styles.subtitle} text-xs mt-0.5`}>{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // Navegar a perfil si existe
                  }}
                  className={`
                    w-full px-4 py-3 text-left text-sm font-semibold
                    ${styles.button.text}
                    hover:bg-opacity-10 transition-all duration-300
                  `}
                  style={{ 
                    backgroundColor: detectedTheme === 'amanecer' 
                      ? 'rgba(74, 144, 226, 0.05)' 
                      : 'rgba(138, 43, 226, 0.05)' 
                  }}
                >
                  Ver Perfil
                </button>
              </div>
            )}
          </div>
        )}

        {/* Toggle de tema - Mejorado */}
        <button
          onClick={toggleTheme}
          className={`
            p-2.5 md:p-3 rounded-xl 
            ${styles.button.base}
            border-2
            transition-all duration-300 transform hover:scale-110 hover:rotate-12
            group shadow-md hover:shadow-lg
          `}
          title={`Cambiar a tema ${isNocturno ? 'Amanecer' : 'Nocturno'}`}
        >
          {isNocturno ? (
            <Sun size={20} className={`${styles.themeIcon} transition-all duration-300`} />
          ) : (
            <Moon size={20} className={`${styles.themeIcon} transition-all duration-300`} />
          )}
        </button>

        {/* Botón de logout - Mejorado */}
        <button
          onClick={handleLogout}
          className={`
            flex items-center space-x-2 px-3 md:px-4 py-2 md:py-3 
            rounded-xl font-bold text-sm
            ${styles.logoutButton.base} ${styles.logoutButton.text}
            border-2
            transition-all duration-300 transform hover:scale-105
            group shadow-md hover:shadow-lg
          `}
        >
          <LogOut size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>

      {/* Overlay para cerrar menú de usuario */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;