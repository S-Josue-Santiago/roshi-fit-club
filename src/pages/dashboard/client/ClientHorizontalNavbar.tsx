import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CreditCard,
  ShoppingCart,
  Dumbbell,
  Settings,
  // Menu, // Importar el icono de Menu para el botón de hamburguesa
} from 'lucide-react';

interface ClientHorizontalNavbarProps {
  subscriptionStatus: string;
  // activeSection: string; // Se derivará de la URL
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

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

const ClientHorizontalNavbar: React.FC<ClientHorizontalNavbarProps> = (
  { subscriptionStatus, isMobileMenuOpen, setIsMobileMenuOpen }
) => {
  const theme = useDashboardThemeDetection();
  const navigate = useNavigate();
  const location = useLocation(); // Obtener la ubicación actual

  // Derivar activeSection de la URL
  // const getActiveSectionFromUrl = (): string => {
  //   const path = location.pathname;
  //   if (path.includes('/dashboard/cliente/suscripcion')) return 'suscripcion';
  //   if (path.includes('/dashboard/cliente/productos')) return 'productos';
  //   if (path.includes('/dashboard/cliente/ejercicios')) return 'ejercicios';
  //   if (path.includes('/dashboard/cliente/cuenta')) return 'cuenta';
  //   if (path.includes('/dashboard/cliente/entrenamientos')) return 'entrenamientos';
  //   return 'dashboard'; // Por defecto
  // };

  // const activeSection = getActiveSectionFromUrl(); // Eliminado

  const isActive = subscriptionStatus === 'activa';

  const sections = isActive
    ? [
        { id: 'suscripcion', name: 'Suscripción', icon: CreditCard },
        { id: 'productos', name: 'Productos', icon: ShoppingCart },
        { id: 'ejercicios', name: 'Ejercicios', icon: Dumbbell },
        { id: 'cuenta', name: 'Cuenta', icon: Settings },
      ]
    : [
        { id: 'suscripcion', name: 'Suscripción', icon: CreditCard },
        { id: 'productos', name: 'Productos', icon: ShoppingCart },
        { id: 'cuenta', name: 'Cuenta', icon: Settings },
      ];

  const handleSectionClick = (sectionId: string) => {
    setIsMobileMenuOpen(false); // Cerrar el menú móvil al hacer clic en una sección
    navigate(`/dashboard/cliente/${sectionId}`); // Navegar a la sección
  };

  // Estilos según tema
  const getStyles = () => {
    if (theme === 'amanecer') {
      return {
        navbarBg: 'bg-gradient-to-r from-slate-50 via-white to-slate-50 border-slate-200',
        itemHover: 'bg-blue-50 text-blue-600',
        activeItem: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30',
        mobileMenuBg: 'bg-white',
        mobileMenuItemHover: 'bg-slate-100',
        mobileMenuItemText: 'text-gray-800',
      };
    }
    
    // Tema Nocturno
    return {
      navbarBg: 'bg-gradient-to-r from-[#0A0E27] via-[#16213E] to-[#0A0E27] border-[#16213E]',
      itemHover: 'bg-[#1A1A2E] text-[#FFD700]',
      activeItem: 'bg-gradient-to-r from-purple-900 to-purple-700 text-white shadow-lg shadow-purple-900/50',
      mobileMenuBg: 'bg-[#0F1333]',
      mobileMenuItemHover: 'bg-[#16213E]',
      mobileMenuItemText: 'text-white',
    };
  };

  const styles = getStyles();

  return (
    <nav className="w-full">
      {/* Navegación horizontal para pantallas grandes */}
      <div 
        className={`hidden lg:flex fixed top-16 left-0 right-0 z-40 justify-center items-center py-3 border-b-2 ${styles.navbarBg}`}
        style={{ boxShadow: theme === 'amanecer' ? '0 5px 15px rgba(0,0,0,0.05)' : '0 5px 15px rgba(0,0,0,0.3)' }}
      >
        {sections.map((section) => {
          const Icon = section.icon;
          const isActiveSection = location.pathname.includes(`/dashboard/cliente/${section.id}`);
          return (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`
                flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm 
                transition-all duration-300 transform hover:scale-105 mx-2
                ${isActiveSection ? styles.activeItem : `${styles.mobileMenuItemText} hover:${styles.itemHover}`}
              `}
            >
              <Icon size={18} />
              {section.name}
            </button>
          );
        })}
      </div>

      {/* Menú de hamburguesa para pantallas pequeñas */}
      <div 
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 z-50 lg:hidden 
          ${styles.mobileMenuBg} transition-transform duration-300 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          border-r-2 ${styles.navbarBg} shadow-xl
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-full p-4 space-y-2">
          {sections.map((section) => {
              const Icon = section.icon;
              const isActiveSection = location.pathname.includes(`/dashboard/cliente/${section.id}`);
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`
                    flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left font-medium
                    ${isActiveSection ? styles.activeItem : `${styles.mobileMenuItemText} hover:${styles.mobileMenuItemHover}`}
                  `}
                >
                  <Icon size={20} />
                  <span>{section.name}</span>
                </button>
              );
            })}
        </div>
      </div>
    </nav>
  );
};

export default ClientHorizontalNavbar;