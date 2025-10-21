// roshi_fit/src/components/dashboard/Sidebar.tsx
// import React, { useState } from 'react';
import React from 'react'; // ← Solo React

import {
  Home,
  Users,
  Shield,
  ShoppingCart,
  Factory,
  BarChart3,
  Dumbbell,
  // Calendar,
  Settings,
  // FileText,
  Image,
  CreditCard,
  Package,
  TrendingUp
} from 'lucide-react';

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', name: 'DASHBOARD', icon: <Home size={18} /> },
  { id: 'usuarios', name: 'USUARIOS', icon: <Users size={18} /> },
  { id: 'roles', name: 'ROLES', icon: <Shield size={18} /> },
  { id: 'productos', name: 'PRODUCTOS', icon: <ShoppingCart size={18} /> },
  { id: 'proveedores', name: 'PROVEEDORES', icon: <Factory size={18} /> },
  { id: 'categorias', name: 'CATEGORÍAS', icon: <BarChart3 size={18} /> },
  { id: 'ejercicios', name: 'EJERCICIOS', icon: <Dumbbell size={18} /> },
  { id: 'servicios', name: 'SERVICIOS', icon: <Dumbbell size={18} /> },
  { id: 'galeria', name: 'GALERÍA', icon: <Image size={18} /> },
  { id: 'suscripciones', name: 'SUSCRIPCIONES', icon: <CreditCard size={18} /> },
  { id: 'ventas', name: 'VENTAS', icon: <Package size={18} /> },
  // { id: 'clases', name: 'CLASES', icon: <Calendar size={18} /> },
  { id: 'equipos', name: 'EQUIPOS', icon: <Dumbbell size={18} /> },
  { id: 'reportes', name: 'REPORTES', icon: <TrendingUp size={18} /> },
  { id: 'configuracion', name: 'CONFIGURACIÓN', icon: <Settings size={18} /> },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-dashboard-sidebar border-r border-dashboard-accent overflow-y-auto">
      <nav className="p-4 space-y-1">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeSection === item.id
                ? 'bg-dashboard-primary text-dashboard-bg font-bold'
                : 'text-dashboard-text hover:bg-dashboard-accent/30'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;