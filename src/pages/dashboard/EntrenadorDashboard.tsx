// roshi_fit/src/pages/dashboard/EntrenadorDashboard.tsx
import React, { useState } from 'react';
import TrainerDashboardLayout from './trainer/TrainerDashboardLayout';

const EntrenadorDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold text-dashboard-primary">
          Sección: {activeSection.replace('_', ' ')}
        </h2>
      </div>
    );
  };

  return (
    <TrainerDashboardLayout onSectionChange={setActiveSection}>
      {renderContent()}
    </TrainerDashboardLayout>
  );
};

export default EntrenadorDashboard;