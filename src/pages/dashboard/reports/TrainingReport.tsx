import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js/auto';
import { fetchTrainingReport } from '../../../api/reportApi';
import type { TrainingReportData } from '../../../types/Report';
import { Dumbbell, UserCheck, Scale } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrainingReport: React.FC = () => {
  const [reportData, setReportData] = useState<TrainingReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const data = await fetchTrainingReport();
        setReportData(data);
      } catch (err: any) {
        console.error('Error loading training report:', err);
        setError('Error al cargar el reporte de entrenamiento.');
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, []);

  const sessionsByTrainerChartData = {
    labels: reportData?.sessionsByTrainer.map(d => d.nombre_completo) || [],
    datasets: [
      {
        label: 'Sesiones Completadas',
        data: reportData?.sessionsByTrainer.map(d => d.sesiones) || [],
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  const sessionsByTrainerChartOptions = {
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
        text: 'Sesiones Completadas por Entrenador (Últimos 30 Días)',
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
        beginAtZero: true,
      },
    },
  };

  const evaluationsChartData = {
    labels: reportData?.evaluations.map(d => d.dia) || [],
    datasets: [
      {
        label: 'Evaluaciones Realizadas',
        data: reportData?.evaluations.map(d => d.evaluaciones) || [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const evaluationsChartOptions = {
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
        text: 'Evaluaciones Físicas Realizadas (Últimos 30 Días)',
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
        beginAtZero: true,
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
    <div id="training-report-content" className="bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-600/20 rounded-lg">
          <Dumbbell size={24} className="text-yellow-400" />
        </div>
        <h1 className="text-2xl font-black text-dashboard-text">REPORTE DE ENTRENAMIENTO Y PROGRESO</h1>
        
      </div>

      {reportData === null || (reportData.sessionsByTrainer.length === 0 && reportData.evaluations.length === 0) ? (
        <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
          <div className="text-6xl mb-4">🏋️</div>
          <p className="text-dashboard-text text-xl font-black">No hay datos de entrenamiento para el reporte.</p>
          <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
            Intenta verificar la base de datos o los filtros de fecha.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Tarjeta de Sesiones Totales por Entrenador (Ejemplo) */}
            <div className="bg-dashboard-bg p-6 rounded-xl border border-dashboard-accent/50 shadow-md flex items-center gap-4">
              <div className="p-3 bg-indigo-600/20 rounded-lg">
                <UserCheck size={28} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-dashboard-text-secondary text-sm font-semibold">Total Sesiones (30 Días)</p>
                <p className="text-3xl font-bold text-indigo-400">{reportData.sessionsByTrainer.reduce((sum, d) => sum + d.sesiones, 0)}</p>
              </div>
            </div>

            {/* Tarjeta de Evaluaciones Realizadas (Ejemplo) */}
            <div className="bg-dashboard-bg p-6 rounded-xl border border-dashboard-accent/50 shadow-md flex items-center gap-4">
              <div className="p-3 bg-red-600/20 rounded-lg">
                <Scale size={28} className="text-red-400" />
              </div>
              <div>
                <p className="text-dashboard-text-secondary text-sm font-semibold">Total Evaluaciones (30 Días)</p>
                <p className="text-3xl font-bold text-red-400">{reportData.evaluations.reduce((sum, d) => sum + d.evaluaciones, 0)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="h-[400px]">
              <Bar data={sessionsByTrainerChartData} options={sessionsByTrainerChartOptions} />
            </div>
            <div className="h-[400px]">
              <Line data={evaluationsChartData} options={evaluationsChartOptions} />
            </div>
          </div>

          <h3 className="text-xl font-black text-dashboard-text mb-4 border-b border-dashboard-accent/50 pb-2">Detalle de Sesiones por Entrenador</h3>
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full divide-y divide-dashboard-accent/30 bg-dashboard-accent/10 rounded-lg">
              <thead className="bg-dashboard-accent/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">Entrenador</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider">Sesiones Completadas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashboard-accent/20">
                {reportData.sessionsByTrainer.map((item, index) => (
                  <tr key={index} className="hover:bg-black hover:bg-opacity-80 transition-all duration-300">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-dashboard-text border-r border-dashboard-accent/30">{item.nombre_completo}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-dashboard-text-secondary">{item.sesiones}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-black text-dashboard-text mb-4 border-b border-dashboard-accent/50 pb-2">Detalle de Evaluaciones Físicas</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dashboard-accent/30 bg-dashboard-accent/10 rounded-lg">
              <thead className="bg-dashboard-accent/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">Día</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider">Evaluaciones Realizadas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashboard-accent/20">
                {reportData.evaluations.map((item, index) => (
                  <tr key={index} className="hover:bg-black hover:bg-opacity-80 transition-all duration-300">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-dashboard-text border-r border-dashboard-accent/30">{item.dia}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-dashboard-text-secondary">{item.evaluaciones}</td>
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

export default TrainingReport;
