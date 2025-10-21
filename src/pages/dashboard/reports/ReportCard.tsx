// roshi_fit/src/pages/dashboard/reports/ReportCard.tsx
import React from 'react';

interface ReportCardProps {
  icon: string;
  title: string;
  value: string;
  onClick: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ icon, title, value, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-dashboard-accent/50 p-6 rounded-xl border border-dashboard-accent hover:bg-dashboard-accent/70 cursor-pointer transition-colors"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-bold text-dashboard-text mb-1">{title}</h3>
      <p className="text-dashboard-primary font-bold">{value}</p>
    </div>
  );
};

export default ReportCard;