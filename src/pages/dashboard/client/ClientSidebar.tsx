// roshi_fit/src/pages/dashboard/client/ClientSidebar.tsx
import React, { useState } from 'react';
import {
  Home,
  CreditCard,
  ShoppingCart,
  Dumbbell,
  TrendingUp,
  Calendar,
  FileText,
  Settings
} from 'lucide-react';

interface ClientSidebarProps {
  subscriptionStatus: string;
  onSectionChange: (section: string) => void;
}

const ClientSidebar: React.FC<ClientSidebarProps> = ({ subscriptionStatus, onSectionChange }) => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const isActive = subscriptionStatus === 'activa';

  const sections = isActive
    ? [
        { id: 'dashboard', name: 'Dashboard', icon: Home },
        { id: 'suscripcion', name: 'Suscripción', icon: CreditCard },
        { id: 'productos', name: 'Productos', icon: ShoppingCart },
        { id: 'ejercicios', name: 'Ejercicios', icon: Dumbbell },
        { id: 'entrenamientos', name: 'Mis Entrenamientos', icon: Dumbbell },
        { id: 'progreso', name: 'Progreso', icon: TrendingUp },
        { id: 'clases', name: 'Clases', icon: Calendar },
        { id: 'evaluaciones', name: 'Mis Evaluaciones', icon: FileText },
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

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-dashboard-sidebar border-r border-dashboard-accent overflow-y-auto">
      <nav className="p-4 space-y-1">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === section.id
                  ? 'bg-dashboard-primary text-dashboard-bg font-bold'
                  : 'text-dashboard-text hover:bg-dashboard-accent/30'
              }`}
            >
              <Icon size={18} />
              <span>{section.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default ClientSidebar;