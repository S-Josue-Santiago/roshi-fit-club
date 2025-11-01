import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js/auto'; // Using 'chart.js/auto' to automatically register all components
import { fetchSubscriptionReport } from '../../../api/reportApi';
import type { SubscriptionReportData } from '../../../types/Report';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SubscriptionReport: React.FC = () => {
  const [reportData, setReportData] = useState<SubscriptionReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const data = await fetchSubscriptionReport();
        setReportData(data);
      } catch (err: any) {
        console.error('Error loading subscription report:', err);
        setError('Error al cargar el reporte de suscripciones.');
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, []);

  const chartData = {
    labels: reportData.map(d => d.plan),
    datasets: [
      {
        label: 'Nuevas Suscripciones',
        data: reportData.map(d => d.nuevas),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Suscripciones Activas',
        data: reportData.map(d => d.activas),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
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
          color: '#e0e0e0', // Tailwind dashboard-text-secondary
        },
      },
      title: {
        display: true,
        text: 'Suscripciones por Plan (Últimos 30 Días)',
        color: '#f8f8f8', // Tailwind dashboard-text
        font: {
          size: 16,
          weight: 'bold' as const, // Explicitly cast to literal type
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
        stacked: true,
        ticks: {
          color: '#9ca3af', // Tailwind dashboard-text-secondary
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)', // Tailwind dashboard-accent/30
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: '#9ca3af', // Tailwind dashboard-text-secondary
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)', // Tailwind dashboard-accent/30
        },
      },
    },
  };

  const totalIncome = reportData.reduce((sum, item) => sum + item.ingresos, 0);

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
    <div id="subscription-report-content" className="bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-teal-600/20 rounded-lg">
          <BarChart3 size={24} className="text-teal-400" />
        </div>
        <h1 className="text-2xl font-black text-dashboard-text">REPORTE DE SUSCRIPCIONES</h1>

      </div>

      {reportData.length === 0 ? (
        <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-dashboard-text text-xl font-black">No hay datos de suscripciones para el reporte.</p>
          <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
            Intenta verificar la base de datos o los filtros de fecha.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Tarjeta de Ingresos Totales */}
            <div className="bg-dashboard-bg p-6 rounded-xl border border-dashboard-accent/50 shadow-md flex items-center gap-4">
              <div className="p-3 bg-teal-600/20 rounded-lg">
                <DollarSign size={28} className="text-teal-400" />
              </div>
              <div>
                <p className="text-dashboard-text-secondary text-sm font-semibold">Ingresos Totales (30 Días)</p>
                <p className="text-3xl font-bold text-teal-400">{new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(totalIncome)}</p>
              </div>
            </div>

            {/* Tarjeta de Resumen de Suscripciones (ejemplo) */}
            <div className="bg-dashboard-bg p-6 rounded-xl border border-dashboard-accent/50 shadow-md flex items-center gap-4">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <TrendingUp size={28} className="text-blue-400" />
              </div>
              <div>
                <p className="text-dashboard-text-secondary text-sm font-semibold">Planes con Mayores Suscripciones Nuevas</p>
                <p className="text-xl font-bold text-blue-400">
                  {reportData.sort((a, b) => b.nuevas - a.nuevas)[0]?.plan || 'N/A'}
                  <span className="ml-2 text-dashboard-text-secondary text-sm">({reportData.sort((a, b) => b.nuevas - a.nuevas)[0]?.nuevas || 0} nuevas)</span>
                </p>
              </div>
            </div>
          </div>

          <div className="h-[400px] mb-8">
            <Bar data={chartData} options={options} />
          </div>

          <h3 className="text-xl font-black text-dashboard-text mb-4 border-b border-dashboard-accent/50 pb-2">Detalle por Plan</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dashboard-accent/30 bg-dashboard-accent/10 rounded-lg">
              <thead className="bg-dashboard-accent/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">Plan</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">Nuevas (30 Días)</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">Activas Actuales</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider">Ingresos (30 Días)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashboard-accent/20">
                {reportData.map((item, index) => (
                  <tr key={index} className="hover:bg-black hover:bg-opacity-80 transition-all duration-300">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-dashboard-text border-r border-dashboard-accent/30">{item.plan}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-dashboard-text-secondary border-r border-dashboard-accent/30">{item.nuevas}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-dashboard-text-secondary border-r border-dashboard-accent/30">{item.activas}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-teal-400">{new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(item.ingresos)}</td>
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

export default SubscriptionReport;
