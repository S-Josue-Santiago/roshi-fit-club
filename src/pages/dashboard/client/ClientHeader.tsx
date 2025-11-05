// roshi_fit/src/pages/dashboard/client/ClientHeader.tsx
import React, { useState, useEffect } from 'react';
import { useDashboardTheme } from '../../../contexts/DashboardThemeContext';
import { ShoppingCart, LogOut, Sun, Moon, User, ChevronDown, Package, CreditCard, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import CartModal from './CartModal';

interface ClientHeaderProps {
  subscriptionStatus: string;
  cartCount: number; // Recibe el contador como prop
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

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

const ClientHeader: React.FC<ClientHeaderProps> = ({ subscriptionStatus, cartCount, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { toggleTheme } = useDashboardTheme(); // Fix: Removed 'theme' as it's not read
  const detectedTheme = useDashboardThemeDetection();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; icon: string; text: string }> = {
      activa: {
        color: detectedTheme === 'amanecer' ? 'text-green-600' : 'text-green-400',
        bg: detectedTheme === 'amanecer' ? 'bg-green-100' : 'bg-green-500/20',
        icon: '✅',
        text: 'Activa'
      },
      vencida: {
        color: detectedTheme === 'amanecer' ? 'text-yellow-600' : 'text-yellow-400',
        bg: detectedTheme === 'amanecer' ? 'bg-yellow-100' : 'bg-yellow-500/20',
        icon: '⚠️',
        text: 'Vencida'
      },
      cancelada: {
        color: detectedTheme === 'amanecer' ? 'text-red-600' : 'text-red-400',
        bg: detectedTheme === 'amanecer' ? 'bg-red-100' : 'bg-red-500/20',
        icon: '❌',
        text: 'Cancelada'
      },
      suspendida: {
        color: detectedTheme === 'amanecer' ? 'text-purple-600' : 'text-purple-400',
        bg: detectedTheme === 'amanecer' ? 'bg-purple-100' : 'bg-purple-500/20',
        icon: '⏸️',
        text: 'Suspendida'
      }
    };
    return configs[status] || {
      color: detectedTheme === 'amanecer' ? 'text-gray-600' : 'text-gray-400',
      bg: detectedTheme === 'amanecer' ? 'bg-gray-100' : 'bg-gray-500/20',
      icon: '❓',
      text: status
    };
  };

  // Estilos según tema
  const getStyles = () => {
    if (detectedTheme === 'amanecer') {
      return {
        header: 'bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100 border-slate-300',
        headerShadow: '0 4px 20px rgba(74, 144, 226, 0.15)',
        logo: 'bg-gradient-to-br from-blue-500 to-purple-600',
        title: 'text-gray-900',
        button: {
          base: 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-slate-300 hover:border-blue-400',
          text: 'text-gray-700 hover:text-blue-600',
          icon: 'text-gray-600'
        },
        cartBadge: 'bg-red-500',
        userCard: 'bg-white border-slate-300',
        userName: 'text-gray-900',
        userSubtext: 'text-gray-600',
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
      title: 'text-white',
      button: {
        base: 'bg-[#16213E]/50 hover:bg-[#16213E] border-purple-500/30 hover:border-purple-500',
        text: 'text-white hover:text-[#FFD700]',
        icon: 'text-[#B0BEC5]'
      },
      cartBadge: 'bg-red-500',
      userCard: 'bg-[#16213E]/50 border-purple-500/20',
      userName: 'text-white',
      userSubtext: 'text-[#B0BEC5]',
      themeIcon: 'text-white group-hover:text-[#FFD700]',
      logoutButton: {
        base: 'bg-red-900/20 hover:bg-red-900/40 border-red-500/40 hover:border-red-500/60',
        text: 'text-red-400 hover:text-red-300'
      }
    };
  };

  const styles = getStyles();
  const statusConfig = getStatusConfig(subscriptionStatus);

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
      {/* Botón de hamburguesa para móviles */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`
            lg:hidden p-2.5 rounded-xl
            ${styles.button.base}
            transition-all duration-300 transform hover:scale-110
            border-2 shadow-md hover:shadow-lg
          `}
          title="Abrir menú"
        >
          <Menu size={20} className={styles.button.icon} />
        </button>
        {/* Logo y Nombre */}
        <div className="flex items-center space-x-3 lg:ml-0">
          <div 
            className={`
              w-10 h-10 md:w-12 md:h-12 ${styles.logo}
              rounded-2xl flex items-center justify-center shadow-xl
              transform hover:scale-110 transition-all duration-300 hover:rotate-6
            `}
          >
            <span className="text-white font-black text-xl md:text-2xl">🐉</span>
          </div>
          <div>
            <h1 className={`text-lg md:text-xl font-black ${styles.title} tracking-tight`}>
              ROSHI FIT
            </h1>
            <p className={`text-xs ${styles.userSubtext} font-semibold`}>
              Portal Cliente
            </p>
          </div>
        </div>
      </div>

      {/* Controles derecho */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Info de usuario y estado */}
        {userData && (
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
                  {userData.nombre.split(' ')[0]}
                </p>
                <div className={`flex items-center gap-1 ${statusConfig.color} text-xs font-semibold`}>
                  <span>{statusConfig.icon}</span>
                  <span>{statusConfig.text}</span>
                </div>
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
                  absolute top-full right-0 mt-2 w-56
                  ${styles.userCard} border-2
                  rounded-xl shadow-xl overflow-hidden
                  transform transition-all duration-300
                  animate-fadeIn
                `}
              >
                <div className="p-4 border-b-2" style={{ borderColor: detectedTheme === 'amanecer' ? '#CBD5E1' : '#16213E' }}>
                  <p className={`${styles.userName} font-black text-base`}>{userData.nombre}</p>
                  <p className={`${styles.userSubtext} text-xs mt-1`}>{userData.email}</p>
                  <div className={`mt-3 px-3 py-2 rounded-lg ${statusConfig.bg} border-2`} style={{ borderColor: statusConfig.color.replace('text-', 'rgb(') }}>
                    <div className="flex items-center justify-between">
                      <span className={`${statusConfig.color} font-bold text-sm`}>
                        {statusConfig.icon} {statusConfig.text}
                      </span>
                      <CreditCard size={16} className={statusConfig.color} />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // Navegar a perfil
                  }}
                  className={`
                    w-full px-4 py-3 text-left text-sm font-semibold
                    ${styles.button.text} flex items-center gap-2
                    hover:bg-opacity-10 transition-all duration-300
                  `}
                  style={{ 
                    backgroundColor: detectedTheme === 'amanecer' 
                      ? 'rgba(74, 144, 226, 0.05)' 
                      : 'rgba(138, 43, 226, 0.05)' 
                  }}
                >
                  <User size={16} />
                  Ver Perfil
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // Navegar a suscripciones
                  }}
                  className={`
                    w-full px-4 py-3 text-left text-sm font-semibold
                    ${styles.button.text} flex items-center gap-2
                    hover:bg-opacity-10 transition-all duration-300
                  `}
                  style={{ 
                    backgroundColor: detectedTheme === 'amanecer' 
                      ? 'rgba(74, 144, 226, 0.05)' 
                      : 'rgba(138, 43, 226, 0.05)' 
                  }}
                >
                  <Package size={16} />
                  Mis Suscripciones
                </button>
              </div>
            )}
          </div>
        )}

        {/* Botón de carrito */}
        <button
          onClick={() => setIsCartOpen(true)}
          className={`
            relative p-2.5 md:p-3 rounded-xl 
            ${styles.button.base}
            transition-all duration-300 transform hover:scale-110
            border-2 shadow-md hover:shadow-lg
          `}
          title="Carrito de compras"
        >
          <ShoppingCart size={20} className={styles.button.icon} />
          {cartCount > 0 && (
            <span className={`
              absolute -top-1 -right-1 
              min-w-[20px] h-5 px-1.5
              ${styles.cartBadge} text-white text-xs font-bold
              rounded-full flex items-center justify-center
              shadow-lg animate-pulse
            `}>
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </button>

        {/* Toggle de tema */}
        <button
          onClick={toggleTheme}
          className={`
            p-2.5 md:p-3 rounded-xl 
            ${styles.button.base}
            border-2
            transition-all duration-300 transform hover:scale-110 hover:rotate-12
            group shadow-md hover:shadow-lg
          `}
          title={`Cambiar a tema ${detectedTheme === 'nocturno' ? 'Amanecer' : 'Nocturno'}`}
        >
          {detectedTheme === 'nocturno' ? (
            <Sun size={20} className={`${styles.themeIcon} transition-all duration-300`} />
          ) : (
            <Moon size={20} className={`${styles.themeIcon} transition-all duration-300`} />
          )}
        </button>

        {/* Botón de logout */}
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

      {/* Modal del carrito */}
      {isCartOpen && userData && (
        <CartModal
          usuarioId={userData.id}
          onClose={() => setIsCartOpen(false)}
          onCheckoutSuccess={() => {
            // La recarga del contador ahora se maneja en el layout principal
            setIsCartOpen(false); 
          }}
        />
      )}

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

export default ClientHeader;