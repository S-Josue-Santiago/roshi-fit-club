// roshi_fit/src/pages/dashboard/reports/ReportList.tsx
import React from 'react';
import SubscriptionReport from './SubscriptionReport';
import ProductReport from './ProductReport';
import UserReport from './UserReport';
import ClassReport from './ClassReport';
import TrainingReport from './TrainingReport';
import EquipmentReport from './EquipmentReport';
import SystemActivityReport from './SystemActivityReport';
import FinancialReport from './FinancialReport'; // Import the new FinancialReport component

const ReportList: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Reporte de Suscripciones */}
      <SubscriptionReport />

      {/* Reporte de Productos */}
      <ProductReport />

      {/* Reporte de Usuarios */}
      <UserReport />

      {/* Reporte de Clases y Asistencia */}
      <ClassReport />

      {/* Reporte de Entrenamiento y Progreso */}
      <TrainingReport />

      {/* Reporte de Equipos */}
      <EquipmentReport />

      {/* Reporte de Actividad del Sistema */}
      <SystemActivityReport />

      {/* Reporte Financiero Consolidado */}
      <FinancialReport />
    </div>
  );
};

export default ReportList; 