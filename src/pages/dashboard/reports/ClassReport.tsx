import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js/auto';
import { fetchClassReport } from '../../../api/reportApi';
import type { ClassReportData } from '../../../types/Report';
import {  CalendarCheck } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ClassReport: React.FC = () => {
  const [reportData, setReportData] = useState<ClassReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const data = await fetchClassReport();
        setReportData(data);
      } catch (err: any) {
        console.error('Error loading class report:', err);
        setError('Error al cargar el reporte de clases.');
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, []);

  const chartData = {
    labels: reportData.map(d => d.clase),
    datasets: [
      {
        label: 'Tasa de Asistencia (%)',
        data: reportData.map(d => d.tasa_asistencia),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e0e0e0',
        },
      },
      title: {
        display: true,
        text: 'Tasa de Asistencia por Clase (Últimos 30 Días)',
        color: '#f8f8f8',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          title: function(context: any) {
            return context[0].label;
          },
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('es-GT').format(context.parsed.y) + '%';
            }
            return label;
          }
        },
        titleColor: '#f8f8f8',
        bodyColor: '#e0e0e0',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderColor: '#4b5563',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
      },
      y: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        beginAtZero: true,
        max: 100,
      },
    },
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
    <div id="class-report-content" className="bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-600/20 rounded-lg">
          <CalendarCheck size={24} className="text-green-400" />
        </div>
        <h1 className="text-2xl font-black text-dashboard-text">REPORTE DE CLASES Y ASISTENCIA</h1>
        
      </div>

      {reportData.length === 0 ? (
        <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
          <div className="text-6xl mb-4">🗓️</div>
          <p className="text-dashboard-text text-xl font-black">No hay datos de clases para el reporte.</p>
          <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
            Intenta verificar la base de datos o los filtros de fecha.
          </p>
        </div>
      ) : (
        <>
          <div className="h-[400px] mb-8">
            <Line data={chartData} options={options} />
          </div>

          <h3 className="text-xl font-black text-dashboard-text mb-4 border-b border-dashboard-accent/50 pb-2">Detalle de Asistencia por Clase</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dashboard-accent/30 bg-dashboard-accent/10 rounded-lg">
              <thead className="bg-dashboard-accent/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">Clase</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">Reservas</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">Asistentes</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider">Tasa de Asistencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashboard-accent/20">
                {reportData.map((item, index) => (
                  <tr key={index} className="hover:bg-black hover:bg-opacity-80 transition-all duration-300">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-dashboard-text border-r border-dashboard-accent/30">{item.clase}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-dashboard-text-secondary border-r border-dashboard-accent/30">{item.reservas}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-dashboard-text-secondary border-r border-dashboard-accent/30">{item.asistentes}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-green-400">{item.tasa_asistencia}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ClassReport;
