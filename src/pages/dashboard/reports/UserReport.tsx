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
import { fetchUserReport } from '../../../api/reportApi';
import type { UserReportData } from '../../../types/Report';
import { UserPlus, Users } from 'lucide-react';
// import { generatePdf } from '../../../utils/reportPdfGenerator'; // Import the utility function

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserReport: React.FC = () => {
  const [reportData, setReportData] = useState<UserReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const data = await fetchUserReport();
        setReportData(data);
      } catch (err: any) {
        console.error('Error loading user report:', err);
        setError('Error al cargar el reporte de usuarios.');
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, []);

  const chartData = {
    labels: reportData?.nuevos.map(d => d.dia) || [],
    datasets: [
      {
        label: 'Nuevos Usuarios',
        data: reportData?.nuevos.map(d => d.nuevos) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
        text: 'Nuevos Usuarios Registrados (Últimos 30 Días)',
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
              label += new Intl.NumberFormat('es-GT').format(context.parsed.y);
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
    <div id="user-report-content" className="bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-600/20 rounded-lg">
          <UserPlus size={24} className="text-red-400" />
        </div>
        <h1 className="text-2xl font-black text-dashboard-text">REPORTE DE USUARIOS</h1>
        
      </div>

      {reportData === null || (reportData.nuevos.length === 0 && reportData.activos === 0) ? (
        <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
          <div className="text-6xl mb-4">👤</div>
          <p className="text-dashboard-text text-xl font-black">No hay datos de usuarios para el reporte.</p>
          <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
            Intenta verificar la base de datos o los filtros de fecha.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Tarjeta de Usuarios Activos */}
            <div className="bg-dashboard-bg p-6 rounded-xl border border-dashboard-accent/50 shadow-md flex items-center gap-4">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <Users size={28} className="text-blue-400" />
              </div>
              <div>
                <p className="text-dashboard-text-secondary text-sm font-semibold">Usuarios Activos (con Suscripción Vigente)</p>
                <p className="text-3xl font-bold text-blue-400">{reportData.activos}</p>
              </div>
            </div>

            {/* Otra tarjeta si es necesaria */}
            <div className="bg-dashboard-bg p-6 rounded-xl border border-dashboard-accent/50 shadow-md flex items-center gap-4">
              <div className="p-3 bg-green-600/20 rounded-lg">
                <UserPlus size={28} className="text-green-400" />
              </div>
              <div>
                <p className="text-dashboard-text-secondary text-sm font-semibold">Total Nuevos Usuarios (30 Días)</p>
                <p className="text-3xl font-bold text-green-400">{reportData.nuevos.reduce((sum, d) => sum + d.nuevos, 0)}</p>
              </div>
            </div>
          </div>

          <div className="h-[400px] mb-8">
            <Line data={chartData} options={options} />
          </div>
        </>
      )}
    </div>
  );
};

export default UserReport;
