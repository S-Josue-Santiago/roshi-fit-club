// roshi_fit/src/components/dashboard/Sidebar.tsx
import React, { useState } from 'react';
import {
  Home,
  Users,
  Shield,
  ShoppingCart,
  Factory,
  BarChart3,
  Dumbbell,
  Settings,
  Image,
  CreditCard,
  Package,
  TrendingUp,
  Menu,
  X
} from 'lucide-react';

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', name: 'DASHBOARD', icon: <Home size={20} /> },
  { id: 'usuarios', name: 'USUARIOS', icon: <Users size={20} /> },
  { id: 'roles', name: 'ROLES', icon: <Shield size={20} /> },
  { id: 'productos', name: 'PRODUCTOS', icon: <ShoppingCart size={20} /> },
  { id: 'proveedores', name: 'PROVEEDORES', icon: <Factory size={20} /> },
  { id: 'categorias', name: 'CATEGORÍAS', icon: <BarChart3 size={20} /> },
  { id: 'ejercicios', name: 'EJERCICIOS', icon: <Dumbbell size={20} /> },
  { id: 'servicios', name: 'SERVICIOS', icon: <Dumbbell size={20} /> },
  { id: 'galeria', name: 'GALERÍA', icon: <Image size={20} /> },
  { id: 'suscripciones', name: 'SUSCRIPCIONES', icon: <CreditCard size={20} /> },
  { id: 'ventas', name: 'VENTAS', icon: <Package size={20} /> },
  { id: 'equipos', name: 'EQUIPOS', icon: <Dumbbell size={20} /> },
  { id: 'reportes', name: 'REPORTES', icon: <TrendingUp size={20} /> },
  { id: 'configuracion', name: 'CONFIGURACIÓN', icon: <Settings size={20} /> },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleItemClick = (sectionId: string) => {
    onSectionChange(sectionId);
    setIsMobileOpen(false); // Cerrar sidebar en móvil al seleccionar
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Botón de menú móvil */}
      <button
        onClick={toggleMobileMenu}
        className="
          lg:hidden fixed top-4 left-4 z-50
          p-3 rounded-xl bg-purple-900 text-white
          shadow-lg hover:shadow-xl transition-all duration-300
          hover:bg-purple-800 hover:scale-110
        "
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay para móvil */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full
        bg-dashboard-sidebar border-r border-dashboard-accent/50
        overflow-y-auto shadow-2xl transition-transform duration-300 z-40
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:top-16 lg:w-64 lg:h-[calc(100vh-4rem)]
      `}>
        
        {/* Header del sidebar - Versión móvil */}
        <div className="lg:hidden p-6 border-b border-dashboard-accent/30 bg-dashboard-sidebar">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">R</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-dashboard-text">Roshi Fit</h2>
              <p className="text-xs text-dashboard-text-secondary">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Header del sidebar - Versión desktop */}
        <div className="hidden lg:block p-6 border-b border-dashboard-accent/30">
          <h2 className="text-lg font-black text-dashboard-text tracking-wide">
            MENÚ PRINCIPAL
          </h2>
          <p className="text-xs text-dashboard-text-secondary mt-1">
            Navegación del sistema
          </p>
        </div>

        {/* Items de navegación */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-4 
                  rounded-xl text-left transition-all duration-300
                  border-2 relative overflow-hidden group
                  ${isActive
                    ? // ESTADO ACTIVO - Morado, negro y morado
                      'bg-purple-900 border-purple-500 text-white font-bold shadow-lg transform scale-105'
                    : // ESTADO NORMAL - Listo para hover (negro y verde)
                      'bg-transparent border-transparent text-dashboard-text hover:bg-black hover:text-green-400 hover:border-green-400'
                  }
                `}
              >
                {/* Efecto de gradiente morado para items activos */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-black to-purple-800 rounded-xl"></div>
                )}

                {/* Efecto de overlay para hover en items inactivos */}
                {!isActive && (
                  <div className="absolute inset-0 bg-green-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                
                {/* Contenido del item */}
                <div className={`relative z-10 transition-transform duration-300 ${
                  isActive 
                    ? 'text-white' 
                    : 'text-dashboard-text group-hover:text-green-400'
                }`}>
                  {item.icon}
                </div>
                
                <span className={`relative z-10 font-semibold text-sm tracking-wide ${
                  isActive 
                    ? 'text-white' 
                    : 'text-dashboard-text group-hover:text-green-400'
                }`}>
                  {item.name}
                </span>

                {/* Indicador lateral para items activos */}
                {isActive && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-8 bg-purple-400 rounded-full"></div>
                  </div>
                )}

                {/* Indicador de hover para items inactivos */}
                {!isActive && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full group-hover:scale-125 transition-transform"></div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>


      </aside>
    </>
  );
};

export default Sidebar;