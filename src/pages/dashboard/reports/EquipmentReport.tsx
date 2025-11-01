import React, { useState, useEffect } from 'react';
import { fetchEquipmentReport } from '../../../api/reportApi';
import type { EquipmentReportData } from '../../../types/Report';
import { Wrench} from 'lucide-react';
// import { generatePdf } from '../../../utils/reportPdfGenerator'; // Import the utility function
// , CalendarX, AlertTriangle, CheckCircle 
const EquipmentReport: React.FC = () => {
  const [reportData, setReportData] = useState<EquipmentReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const data = await fetchEquipmentReport();
        setReportData(data);
      } catch (err: any) {
        console.error('Error loading equipment report:', err);
        setError('Error al cargar el reporte de equipos.');
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Vencida':
        return 'text-red-400 bg-red-600/20';
      case 'Próxima':
        return 'text-yellow-400 bg-yellow-600/20';
      case 'Al día':
        return 'text-green-400 bg-green-600/20';
      default:
        return 'text-gray-400 bg-gray-600/20';
    }
  };

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
    <div id="equipment-report-content" className="bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-600/20 rounded-lg">
          <Wrench size={24} className="text-indigo-400" />
        </div>
        <h1 className="text-2xl font-black text-dashboard-text">REPORTE DE EQUIPOS</h1>
        
      </div>

      {reportData.length === 0 ? (
        <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
          <div className="text-6xl mb-4">🛠️</div>
          <p className="text-dashboard-text text-xl font-black">No hay datos de equipos para el reporte.</p>
          <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
            Verifica que haya equipos registrados o activos.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dashboard-accent/30 bg-dashboard-accent/10 rounded-lg">
            <thead className="bg-dashboard-accent/50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">Equipo</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">Estado General</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">Próxima Revisión</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider">Estado de Revisión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-accent/20">
              {reportData.map((item, index) => (
                <tr key={index} className="hover:bg-black hover:bg-opacity-80 transition-all duration-300">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-dashboard-text border-r border-dashboard-accent/30">{item.nombre}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-dashboard-text-secondary border-r border-dashboard-accent/30">{item.estado_equipo}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-dashboard-text-secondary border-r border-dashboard-accent/30">{item.proxima_revision || 'N/A'}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border border-current/30 capitalize ${getStatusColor(item.estado_revision)}`}>
                      {item.estado_revision}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EquipmentReport;
