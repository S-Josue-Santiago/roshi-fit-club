// roshi_fit/src/pages/dashboard/AdminDashboard.tsx
import React from 'react';
import { DashboardThemeProvider } from '../../contexts/DashboardThemeContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const AdminDashboard: React.FC = () => {
  return (
    <DashboardThemeProvider>
      <DashboardLayout />
    </DashboardThemeProvider>
  );
};

export default AdminDashboard;