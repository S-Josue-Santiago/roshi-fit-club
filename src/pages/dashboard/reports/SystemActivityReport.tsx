import React, { useState, useEffect } from 'react';
import { fetchSystemActivityReport } from '../../../api/reportApi';
import type { SystemActivityReportData } from '../../../types/Report';
import { Activity } from 'lucide-react';
// import { generatePdf } from '../../../utils/reportPdfGenerator'; // Import the utility function
// , Clock
const SystemActivityReport: React.FC = () => {
  const [reportData, setReportData] = useState<SystemActivityReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const data = await fetchSystemActivityReport();
        setReportData(data);
      } catch (err: any) {
        console.error('Error loading system activity report:', err);
        setError('Error al cargar el reporte de actividad del sistema.');
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dashboard-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-12">{error}</div>;
  }

  return (
    <div id="system-activity-report-content" className="bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-600/20 rounded-lg">
          <Activity size={24} className="text-purple-400" />
        </div>
        <h1 className="text-2xl font-black text-dashboard-text">REPORTE DE ACTIVIDAD DEL SISTEMA</h1>
        
      </div>

      {reportData.length === 0 ? (
        <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
          <div className="text-6xl mb-4">⏱️</div>
          <p className="text-dashboard-text text-xl font-black">No hay datos de actividad del sistema para el reporte.</p>
          <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
            Verifica que se estén registrando las actividades de los usuarios.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dashboard-accent/30 bg-dashboard-accent/10 rounded-lg">
            <thead className="bg-dashboard-accent/50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">Acción</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider">Frecuencia (Últimos 7 Días)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-accent/20">
              {reportData.map((item, index) => (
                <tr key={index} className="hover:bg-black hover:bg-opacity-80 transition-all duration-300">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-dashboard-text border-r border-dashboard-accent/30">{item.accion}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-dashboard-text-secondary">{item.frecuencia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SystemActivityReport;
