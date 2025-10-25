// roshi_fit/src/pages/dashboard/trainer/TrainerSidebar.tsx
import React, { useState } from 'react';
import {
  Home,
  Users,
  FileText,
  Dumbbell,
  Calendar,
  TrendingUp,
  MessageCircle,
  Settings
} from 'lucide-react';

interface TrainerSidebarProps {
  onSectionChange: (section: string) => void;
}

const TrainerSidebar: React.FC<TrainerSidebarProps> = ({ onSectionChange }) => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const sections = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'clientes', name: 'Mis Clientes', icon: Users },
    { id: 'evaluaciones', name: 'Evaluaciones', icon: FileText },
    { id: 'planes', name: 'Mis Planes', icon: Dumbbell },
    { id: 'clases', name: 'Mis Clases', icon: Calendar },
    { id: 'progreso', name: 'Progreso de Clientes', icon: TrendingUp },
    { id: 'mensajes', name: 'Mensajes', icon: MessageCircle },
    { id: 'cuenta', name: 'Mi Cuenta', icon: Settings },
  ];

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    onSectionChange(sectionId);
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

export default TrainerSidebar;