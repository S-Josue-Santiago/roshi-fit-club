// roshi_fit/src/pages/dashboard/client/ClientSidebar.tsx
import React, { useState, useEffect } from 'react';
import {
  // Home, // Fix: Removed unused import
  CreditCard,
  ShoppingCart,
  Dumbbell,
  // TrendingUp, // Fix: Removed unused import
  // Calendar, // Fix: Removed unused import
  // FileText, // Fix: Removed unused import
  Settings,
  ChevronDown,
  ChevronRight,
  Lock
} from 'lucide-react';

interface ClientSidebarProps {
  subscriptionStatus: string;
  onSectionChange: (section: string) => void;
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

const ClientSidebar: React.FC<ClientSidebarProps> = ({ subscriptionStatus, onSectionChange }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const theme = useDashboardThemeDetection();

  const isActive = subscriptionStatus === 'activa';

  const sections = isActive
    ? [
        // { id: 'dashboard', name: 'Dashboard', icon: Home },
        { id: 'suscripcion', name: 'Suscripción', icon: CreditCard },
        { id: 'productos', name: 'Productos', icon: ShoppingCart },
        { id: 'ejercicios', name: 'Ejercicios', icon: Dumbbell },
        // { id: 'entrenamientos', name: 'Mis Entrenamientos', icon: Dumbbell },
        // { id: 'progreso', name: 'Progreso', icon: TrendingUp },
        // { id: 'clases', name: 'Clases', icon: Calendar },
        // { id: 'evaluaciones', name: 'Mis Evaluaciones', icon: FileText },
        { id: 'cuenta', name: 'Cuenta', icon: Settings },
      ]
    : [
        { id: 'suscripcion', name: 'Suscripción', icon: CreditCard },
        { id: 'productos', name: 'Productos', icon: ShoppingCart },
        { id: 'cuenta', name: 'Cuenta', icon: Settings },
      ];

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Estilos según tema
  const getStyles = () => {
    if (theme === 'amanecer') {
      return {
        sidebar: 'bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 border-slate-300',
        header: 'bg-gradient-to-r from-blue-50 to-purple-50 border-slate-200',
        headerTitle: 'text-gray-900',
        headerSubtitle: 'text-gray-600',
        statusBadge: {
          active: 'bg-green-100 text-green-700 border-green-400',
          inactive: 'bg-red-100 text-red-700 border-red-400'
        },
        activeButton: {
          bg: 'bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600',
          border: 'border-blue-400',
          text: 'text-white',
          shadow: 'shadow-lg shadow-blue-500/30'
        },
        inactiveButton: {
          bg: 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50',
          border: 'border-slate-200 hover:border-blue-400',
          text: 'text-gray-700 hover:text-blue-600',
          icon: 'text-gray-600 group-hover:text-blue-600'
        },
        indicator: 'bg-blue-500',
        collapseButton: 'bg-white border-slate-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600',
        scrollbar: {
          track: 'rgba(226, 232, 240, 0.5)',
          thumb: 'rgba(74, 144, 226, 0.5)',
          thumbHover: 'rgba(74, 144, 226, 0.8)'
        }
      };
    }
    
    // Tema Nocturno
    return {
      sidebar: 'bg-gradient-to-b from-[#0A0E27] via-[#0F1333] to-[#0A0E27] border-[#16213E]',
      header: 'bg-gradient-to-r from-[#16213E] to-[#1A1A2E] border-[#16213E]',
      headerTitle: 'text-white',
      headerSubtitle: 'text-[#B0BEC5]',
      statusBadge: {
        active: 'bg-green-500/20 text-green-400 border-green-500',
        inactive: 'bg-red-500/20 text-red-400 border-red-500'
      },
      activeButton: {
        bg: 'bg-gradient-to-r from-purple-900 via-[#1A1A2E] to-purple-800',
        border: 'border-purple-500',
        text: 'text-white',
        shadow: 'shadow-lg shadow-purple-900/50'
      },
      inactiveButton: {
        bg: 'bg-transparent hover:bg-gradient-to-r hover:from-[#1A1A2E] hover:to-[#16213E]',
        border: 'border-transparent hover:border-[#FFD700]',
        text: 'text-white hover:text-[#FFD700]',
        icon: 'text-[#B0BEC5] group-hover:text-[#FFD700]'
      },
      indicator: 'bg-[#FFD700]',
      collapseButton: 'bg-[#16213E] border-purple-500 text-white hover:bg-purple-900 hover:border-[#FFD700]',
      scrollbar: {
        track: 'rgba(22, 33, 62, 0.5)',
        thumb: 'rgba(138, 43, 226, 0.5)',
        thumbHover: 'rgba(138, 43, 226, 0.8)'
      }
    };
  };

  const styles = getStyles();

  return (
    <aside 
      className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)]
        ${styles.sidebar} border-r-2
        overflow-y-auto custom-scrollbar shadow-2xl transition-all duration-500 z-30
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}
      style={{
        boxShadow: theme === 'amanecer' 
          ? '4px 0 20px rgba(74, 144, 226, 0.1)' 
          : '4px 0 20px rgba(138, 43, 226, 0.2)'
      }}
    >
      
      {/* Header del sidebar */}
      <div className={`p-6 border-b-2 ${styles.header} transition-all duration-300`}>
        {!isCollapsed ? (
          <div>
            <h2 className={`text-lg font-black ${styles.headerTitle} tracking-wide`}>
              MENÚ CLIENTE
            </h2>
            <p className={`text-xs ${styles.headerSubtitle} mt-1 font-semibold`}>
              Panel de control
            </p>
            
            {/* Badge de estado */}
            <div className={`
              mt-3 px-3 py-2 rounded-xl border-2 text-center font-bold text-sm
              ${isActive ? styles.statusBadge.active : styles.statusBadge.inactive}
              shadow-md
            `}>
              {isActive ? (
                <span className="flex items-center justify-center gap-2">
                  ✅ Suscripción Activa
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock size={14} />
                  Suscripción Inactiva
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl">👤</div>
            <div className={`
              w-3 h-3 rounded-full
              ${isActive ? 'bg-green-500' : 'bg-red-500'}
              shadow-lg
            `}></div>
          </div>
        )}
      </div>

      {/* Items de navegación */}
      <nav className="p-4 space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActiveSection = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`
                w-full flex items-center px-4 py-4 
                rounded-2xl text-left transition-all duration-300
                border-2 relative overflow-hidden group
                ${isActiveSection
                  ? `${styles.activeButton.bg} ${styles.activeButton.border} ${styles.activeButton.text} ${styles.activeButton.shadow} transform scale-105 font-bold`
                  : `${styles.inactiveButton.bg} ${styles.inactiveButton.border} ${styles.inactiveButton.text}`
                }
                ${isCollapsed ? 'justify-center' : 'space-x-3'}
              `}
              title={isCollapsed ? section.name : ''}
            >
              {/* Efecto de brillo para items activos */}
              {isActiveSection && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              )}
              
              {/* Icono */}
              <div className={`relative z-10 transition-all duration-300 flex-shrink-0 ${
                isActiveSection 
                  ? 'text-white scale-110' 
                  : styles.inactiveButton.icon
              }`}>
                <Icon size={20} />
              </div>
              
              {/* Nombre de la sección */}
              {!isCollapsed && (
                <span className={`relative z-10 font-bold text-sm tracking-wide flex-1 ${
                  isActiveSection 
                    ? 'text-white' 
                    : styles.inactiveButton.text
                }`}>
                  {section.name}
                </span>
              )}

              {/* Indicador lateral para items activos */}
              {isActiveSection && !isCollapsed && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className={`w-2 h-10 ${styles.indicator} rounded-full shadow-lg`}></div>
                </div>
              )}

              {/* Indicador de punto para items activos colapsados */}
              {isActiveSection && isCollapsed && (
                <div className="absolute top-2 right-2">
                  <div className={`w-2 h-2 ${styles.indicator} rounded-full`}></div>
                </div>
              )}
            </button>
          );
        })}

        {/* Mensaje si la suscripción está inactiva */}
        {!isActive && !isCollapsed && (
          <div className={`
            mt-4 p-4 rounded-2xl border-2
            ${theme === 'amanecer' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' : 'bg-yellow-500/10 border-yellow-500 text-yellow-400'}
            text-xs font-semibold text-center
          `}>
            <Lock size={20} className="mx-auto mb-2" />
            <p>Activa tu suscripción para acceder a todas las funciones</p>
          </div>
        )}
      </nav>

      {/* Botón de colapsar/expandir */}
      <div className="p-4 border-t-2" style={{ borderColor: theme === 'amanecer' ? '#CBD5E1' : '#16213E' }}>
        <button
          onClick={toggleCollapse}
          className={`
            w-full flex items-center justify-center px-4 py-3
            rounded-2xl border-2 transition-all duration-300
            ${styles.collapseButton} font-bold text-sm
            hover:scale-105 shadow-md hover:shadow-lg
          `}
        >
          {isCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <>
              <ChevronDown size={20} className="mr-2" />
              <span>Contraer</span>
            </>
          )}
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${styles.scrollbar.track};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${styles.scrollbar.thumb};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${styles.scrollbar.thumbHover};
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </aside>
  );
};

export default ClientSidebar;