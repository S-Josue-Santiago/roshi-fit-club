// roshi_fit/src/pages/dashboard/reports/ReportDetail.tsx
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import {
  fetchSubscriptionReport,
  fetchProductReport,
  fetchUserReport,
  fetchClassReport,
  fetchEquipmentReport
} from '../../../api/reportApi';
import type {
  SubscriptionReportItem,
  ProductReportItem,
  // UserReport,
  ClassReportItem,
  EquipmentReportItem
} from '../../../types/Report';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

interface ReportDetailProps {
  reportType: string;
  onClose: () => void;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ reportType, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      try {
        let reportData;
        switch (reportType) {
          case 'subscriptions':
            reportData = await fetchSubscriptionReport();
            break;
          case 'products':
            reportData = await fetchProductReport();
            break;
          case 'users':
            reportData = await fetchUserReport();
            break;
          case 'classes':
            reportData = await fetchClassReport();
            break;
          case 'equipment':
            reportData = await fetchEquipmentReport();
            break;
          default:
            reportData = [];
        }
        setData(reportData);
      } catch (error) {
        console.error('Error al cargar el reporte:', error);
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, [reportType]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data || []);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, `reporte_${reportType}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const getReportTitle = () => {
    const titles: Record<string, string> = {
      subscriptions: 'Reporte de Suscripciones',
      products: 'Reporte de Productos',
      users: 'Reporte de Usuarios',
      classes: 'Reporte de Clases',
      equipment: 'Reporte de Equipos'
    };
    return titles[reportType] || 'Reporte Detallado';
  };

  const renderChart = () => {
    if (loading || !data) return null;

    switch (reportType) {
      case 'subscriptions':
        const subsData = data as SubscriptionReportItem[];
        return (
          <Bar
            data={{
              labels: subsData.map(s => s.plan),
              datasets: [
                {
                  label: 'Nuevas',
                  data: subsData.map(s => s.nuevas),
                  backgroundColor: 'rgba(54, 162, 235, 0.6)'
                },
                {
                  label: 'Activas',
                  data: subsData.map(s => s.activas),
                  backgroundColor: 'rgba(75, 192, 192, 0.6)'
                }
              ]
            }}
            options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
          />
        );

      case 'products':
        const productsData = data as ProductReportItem[];
        return (
          <Bar
            data={{
              labels: productsData.map(p => p.nombre),
              datasets: [{
                label: 'Unidades Vendidas',
                data: productsData.map(p => p.unidades),
                backgroundColor: 'rgba(255, 99, 132, 0.6)'
              }]
            }}
            options={{ indexAxis: 'y' as const, responsive: true }}
          />
        );

      case 'classes':
        const classesData = data as ClassReportItem[];
        return (
          <Line
            data={{
              labels: classesData.map(c => c.clase),
              datasets: [{
                label: 'Tasa de Asistencia (%)',
                data: classesData.map(c => c.tasa_asistencia),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }]
            }}
            options={{ responsive: true }}
          />
        );

      default:
        return <p className="text-dashboard-text">Gráfico no disponible para este reporte.</p>;
    }
  };

  const renderTable = () => {
    if (loading || !data) return null;

    switch (reportType) {
      case 'subscriptions':
        return (
          <table className="w-full text-dashboard-text">
            <thead>
              <tr className="border-b border-dashboard-accent">
                <th className="py-2 px-4 text-left">Plan</th>
                <th className="py-2 px-4 text-left">Nuevas</th>
                <th className="py-2 px-4 text-left">Activas</th>
                <th className="py-2 px-4 text-left">Ingresos (Q)</th>
              </tr>
            </thead>
            <tbody>
              {(data as SubscriptionReportItem[]).map((item, i) => (
                <tr key={i} className="border-b border-dashboard-accent/50">
                  <td>{item.plan}</td>
                  <td>{item.nuevas}</td>
                  <td>{item.activas}</td>
                  <td>{Number(item.ingresos).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'products':
        return (
          <table className="w-full text-dashboard-text">
            <thead>
              <tr className="border-b border-dashboard-accent">
                <th className="py-2 px-4 text-left">Producto</th>
                <th className="py-2 px-4 text-left">Unidades</th>
                <th className="py-2 px-4 text-left">Ingresos (Q)</th>
              </tr>
            </thead>
            <tbody>
              {(data as ProductReportItem[]).map((item, i) => (
                <tr key={i} className="border-b border-dashboard-accent/50">
                  <td>{item.nombre}</td>
                  <td>{item.unidades}</td>
                  <td>{Number(item.ingresos).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'equipment':
        return (
          <table className="w-full text-dashboard-text">
            <thead>
              <tr className="border-b border-dashboard-accent">
                <th className="py-2 px-4 text-left">Equipo</th>
                <th className="py-2 px-4 text-left">Estado</th>
                <th className="py-2 px-4 text-left">Próxima Revisión</th>
                <th className="py-2 px-4 text-left">Alerta</th>
              </tr>
            </thead>
            <tbody>
              {(data as EquipmentReportItem[]).map((item, i) => (
                <tr key={i} className="border-b border-dashboard-accent/50">
                  <td>{item.nombre}</td>
                  <td>{item.estado_equipo}</td>
                  <td>{item.proxima_revision}</td>
                  <td className={item.estado_revision === 'Vencida' ? 'text-red-400' : item.estado_revision === 'Próxima' ? 'text-yellow-400' : 'text-green-400'}>
                    {item.estado_revision}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return <p className="text-dashboard-text">Tabla no disponible para este reporte.</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div
        className="bg-dashboard-accent/90 p-6 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-dashboard-accent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-dashboard-accent pb-2">
          <h2 className="text-2xl font-bold text-dashboard-text">{getReportTitle()}</h2>
          <div className="flex space-x-3">
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-dashboard-primary text-dashboard-bg font-semibold rounded hover:bg-dashboard-secondary transition-colors"
            >
              📥 Exportar
            </button>
            <button
              onClick={onClose}
              className="text-dashboard-text hover:text-dashboard-primary text-2xl"
            >
              &times;
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-dashboard-text py-6 text-center">Cargando reporte...</p>
        ) : (
          <>
            <div className="my-6 h-80">
              {renderChart()}
            </div>
            <div className="mt-6 overflow-x-auto">
              {renderTable()}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportDetail;