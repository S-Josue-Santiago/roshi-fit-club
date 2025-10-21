// roshi_fit/src/pages/dashboard/ClienteDashboard.tsx
import React, { useState, useEffect } from 'react';
import ClientLayout from './client/ClientLayout';

// Simulación de secciones disponibles
const SECTIONS = [
  'dashboard',
  'suscripcion',
  'productos',
  'ejercicios',
  'entrenamientos',
  'progreso',
  'clases',
  'evaluaciones',
  'cuenta'
];

const ClienteDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  // En una implementación real, esto vendría del sidebar o de la URL
  // Por ahora, lo simulamos con un estado local

  // Cargar el estado de suscripción desde localStorage (simulado)
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Si no tiene estado de suscripción, asumimos 'activa'
        if (!user.subscriptionStatus) {
          const updatedUser = { ...user, subscriptionStatus: 'activa' };
          localStorage.setItem('userData', JSON.stringify(updatedUser));
        }
      } catch (e) {
        console.error('Error al leer userData:', e);
      }
    }
  }, []);

  return (
    <ClientLayout>
      <div className="p-4">
        <h2 className="text-2xl font-bold text-dashboard-primary">
          Sección: {SECTIONS.find(s => s === activeSection) || activeSection}
        </h2>
        <p className="mt-2 text-dashboard-text-secondary">
          Contenido de la sección seleccionada.
        </p>
      </div>
    </ClientLayout>
  );
};

export default ClienteDashboard;