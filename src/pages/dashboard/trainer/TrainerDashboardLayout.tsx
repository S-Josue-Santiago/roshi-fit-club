// roshi_fit/src/pages/dashboard/trainer/TrainerDashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardThemeProvider, useDashboardTheme } from '../../../contexts/DashboardThemeContext';
import TrainerHeader from './TrainerHeader';
import TrainerSidebar from './TrainerSidebar';

interface TrainerDashboardLayoutProps {
  children: React.ReactNode;
  onSectionChange: (section: string) => void;
}

const TrainerDashboardLayoutContent: React.FC<TrainerDashboardLayoutProps> = ({ children, onSectionChange }) => {
  const { theme } = useDashboardTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.tipo !== 'entrenador') {
        navigate('/dashboard/cliente');
      }
    } catch (e) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-dashboard-bg text-dashboard-text">
      <TrainerHeader />
      <TrainerSidebar onSectionChange={onSectionChange} />
      <main className="ml-64 pt-16 px-6 pb-8">
        {children}
      </main>
    </div>
  );
};

const TrainerDashboardLayout: React.FC<TrainerDashboardLayoutProps> = ({ children, onSectionChange }) => {
  return (
    <DashboardThemeProvider>
      <TrainerDashboardLayoutContent onSectionChange={onSectionChange}>
        {children}
      </TrainerDashboardLayoutContent>
    </DashboardThemeProvider>
  );
};

export default TrainerDashboardLayout;