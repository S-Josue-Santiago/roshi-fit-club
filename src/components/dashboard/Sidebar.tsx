// roshi_fit/src/components/dashboard/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Importar useLocation y useNavigate
import {
  // Home, // Fix: Removed unused import
  Users,
  Shield,
  ShoppingCart,
  Factory,
  BarChart3,
  Dumbbell,
  Settings, // Importar el icono de Settings
  Image,
  CreditCard,
  Package,
  // TrendingUp, // Fix: Removed unused import
  TrendingUp,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  subItems?: SidebarItem[]; // Para sub-menús como los de configuración
}

const sidebarItems: SidebarItem[] = [
  // { id: 'dashboard', name: 'DASHBOARD', icon: <Home size={20} /> },
  { id: 'usuarios', name: 'USUARIOS', icon: <Users size={20} /> },
  { id: 'roles', name: 'ROLES', icon: <Shield size={20} /> },
  { id: 'productos', name: 'PRODUCTOS', icon: <ShoppingCart size={20} /> },
  { id: 'proveedores', name: 'PROVEEDORES', icon: <Factory size={20} /> },
  { id: 'categorias', name: 'CATEGORÍAS', icon: <BarChart3 size={20} /> },
  { id: 'ejercicios', name: 'EJERCICIOS', icon: <Dumbbell size={20} /> },
  { id: 'servicios', name: 'SERVICIOS', icon: <Dumbbell size={20} /> },
  { id: 'galeria', name: 'GALERÍA', icon: <Image size={20} /> },
  // { id: 'suscripciones', name: 'SUSCRIPCIONES', icon: <CreditCard size={20} /> }, // Eliminado para ser un menú con sub-items
  { 
    id: 'suscripciones', 
    name: 'SUSCRIPCIONES', 
    icon: <CreditCard size={20} />,
    subItems: [
      { id: 'listado', name: 'Listado de Suscripciones', icon: <CreditCard size={20} /> },
      { id: 'planes', name: 'Planes', icon: <Package size={20} /> }, // Usar Package como icono para planes
    ]
  },
  { id: 'ventas', name: 'VENTAS', icon: <Package size={20} /> },
  { id: 'equipos', name: 'EQUIPOS', icon: <Dumbbell size={20} /> },
  { id: 'reportes', name: 'REPORTES', icon: <TrendingUp size={20} /> },
  { 
    id: 'configuracion', 
    name: 'CONFIGURACIÓN', 
    icon: <Settings size={20} />,
    subItems: [
      { id: 'general', name: 'General', icon: <Users size={20} /> }, // Icono placeholder, cambiar si es necesario
      { id: 'site-content', name: 'Contenido del Sitio', icon: <Image size={20} /> }, // Icono placeholder
    ]
  },
  
];

interface SidebarProps {
  // activeSection: string; // Ya no se necesita onSectionChange como antes
  // onSectionChange: (section: string) => void;
  isCollapsed: boolean; // New prop
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>; // New prop
}

// Hook para detectar el tema del dashboard
const useDashboardTheme = () => {
  const [theme, setTheme] = useState<'nocturno' | 'amanecer'>('nocturno');

  useEffect(() => {
    const checkTheme = () => {
      const bodyClass = document.body.className;
      if (bodyClass.includes('theme-dashboard-amanecer')) {
        setTheme('amanecer');
      } else {
        setTheme('nocturno');
      }
    };

    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return theme;
};

const Sidebar: React.FC<SidebarProps> = ({ /* activeSection, onSectionChange, */ isCollapsed, setIsCollapsed }) => {
  const theme = useDashboardTheme();
  const navigate = useNavigate();
  const location = useLocation(); // Para saber la ruta actual
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    // Abrir submenú de configuración si la URL lo indica
    if (location.pathname.includes('/dashboard/admin/settings')) {
      setOpenSubmenu('configuracion');
    } else if (location.pathname.includes('/dashboard/admin/suscripciones')) {
      setOpenSubmenu('suscripciones');
    } else {
      setOpenSubmenu(null);
    }
  }, [location.pathname]);

  const handleItemClick = (itemId: string, isSubItem: boolean = false) => {
    if (isSubItem) {
      if (location.pathname.includes('/dashboard/admin/settings')) {
        navigate(`/dashboard/admin/settings/${itemId}`);
      } else if (location.pathname.includes('/dashboard/admin/suscripciones')) {
        navigate(`/dashboard/admin/suscripciones/${itemId}`);
      }
    } else if (itemId === 'configuracion') {
      // Toggle submenu
      setOpenSubmenu(openSubmenu === 'configuracion' ? null : 'configuracion');
      // Navigate to default sub-item if opening the menu
      if (openSubmenu !== 'configuracion') {
        navigate('/dashboard/admin/settings/general');
      }
    } else if (itemId === 'suscripciones') {
      // Toggle submenu
      setOpenSubmenu(openSubmenu === 'suscripciones' ? null : 'suscripciones');
      // Navigate to default sub-item if opening the menu
      if (openSubmenu !== 'suscripciones') {
        navigate('/dashboard/admin/suscripciones/listado');
      }
    } else {
      navigate(`/dashboard/admin/${itemId}`);
      setOpenSubmenu(null); // Close submenus when changing main section
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
        logo: 'bg-gradient-to-br from-blue-500 to-purple-600',
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
      logo: 'bg-gradient-to-br from-purple-900 to-purple-700',
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
    <>
      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 h-full
          ${styles.sidebar} border-r-2
          overflow-y-auto custom-scrollbar shadow-2xl transition-all duration-500 z-40
          w-20 // Default width for mobile (always collapsed)
          lg:top-16 lg:h-[calc(100vh-4rem)] // Desktop fixed position and height
          ${isCollapsed ? 'lg:w-20' : 'lg:w-72'} // Desktop collapse/expand width
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${styles.logo} rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white font-black text-xl">R</span>
                </div>
                <div>
                  <h2 className={`text-xl font-black ${styles.headerTitle} tracking-wide`}>
                    Roshi Fit
                  </h2>
                  <p className={`text-xs ${styles.headerSubtitle} mt-0.5 font-semibold`}>
                    Dashboard Admin
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className={`w-12 h-12 ${styles.logo} rounded-2xl flex items-center justify-center shadow-lg`}>
                <span className="text-white font-black text-xl">R</span>
              </div>
            </div>
          )}
        </div>

        {/* Items de navegación */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const isSubmenuOpen = openSubmenu === item.id;
            const isActive = location.pathname.includes(`/dashboard/admin/${item.id}`) || 
                             (item.subItems && item.subItems.some(sub => location.pathname.includes(`/dashboard/admin/${item.id}/${sub.id}`))) ||
                             (item.id === 'usuarios' && location.pathname === '/dashboard/admin'); // Para la ruta por defecto del admin
            
            return (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center px-4 py-4 
                    rounded-2xl text-left transition-all duration-300
                    border-2 relative overflow-hidden group
                    ${isActive
                      ? `${styles.activeButton.bg} ${styles.activeButton.border} ${styles.activeButton.text} ${styles.activeButton.shadow} transform scale-105 font-bold`
                      : `${styles.inactiveButton.bg} ${styles.inactiveButton.border} ${styles.inactiveButton.text}`
                    }
                    ${isCollapsed ? 'justify-center' : 'space-x-3'}
                  `}
                  title={isCollapsed ? item.name : ''}
                >
                  {/* Efecto de brillo para items activos */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                  )}
                  
                  {/* Icono */}
                  <div className={`relative z-10 transition-all duration-300 flex-shrink-0 ${
                    isActive 
                      ? 'text-white scale-110' 
                      : styles.inactiveButton.icon
                  }`}>
                    {item.icon}
                  </div>
                  
                  {/* Nombre del item */}
                  {!isCollapsed && (
                    <span className={`relative z-10 font-bold text-sm tracking-wide flex-1 ${
                      isActive 
                        ? 'text-white' 
                        : styles.inactiveButton.text
                    }`}>
                      {item.name}
                    </span>
                  )}

                  {/* Flecha para submenú */}
                  {!isCollapsed && item.subItems && (
                    <div className={`relative z-10 transition-transform duration-300 ${openSubmenu === item.id ? 'rotate-90' : ''}`}>
                      <ChevronRight size={16} className={styles.inactiveButton.icon} />
                    </div>
                  )}

                  {/* Indicador lateral para items activos */}
                  {isActive && !isCollapsed && !item.subItems && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className={`w-2 h-10 ${styles.indicator} rounded-full shadow-lg`}></div>
                    </div>
                  )}

                  {/* Indicador de punto para items activos colapsados */}
                  {isActive && isCollapsed && (
                    <div className="absolute top-2 right-2">
                      <div className={`w-2 h-2 ${styles.indicator} rounded-full`}></div>
                    </div>
                  )}
                </button>

                {item.subItems && !isCollapsed && isSubmenuOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems.map(subItem => {
                      const isSubItemActive = location.pathname.includes(`/dashboard/admin/${item.id}/${subItem.id}`);
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleItemClick(subItem.id, true)}
                          className={`
                            w-full flex items-center px-3 py-2 
                            rounded-lg text-left transition-all duration-200
                            ${isSubItemActive
                              ? `bg-dashboard-primary text-white font-semibold shadow-sm`
                              : `text-dashboard-text-secondary hover:bg-dashboard-accent/20`
                            }
                          `}
                        >
                          {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                          <span className="text-sm">{subItem.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </React.Fragment>
            );
          })}
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
      </aside>

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
    </>
  );
};

export default Sidebar;