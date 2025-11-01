import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js/auto';
import { fetchFinancialReport } from '../../../api/reportApi';
import type { FinancialReportData } from '../../../types/Report';
import { DollarSign, Wallet } from 'lucide-react';
// import { generatePdf } from '../../../utils/reportPdfGenerator'; // Import the utility function

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const FinancialReport: React.FC = () => {
  const [reportData, setReportData] = useState<FinancialReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const data = await fetchFinancialReport();
        setReportData(data);
      } catch (err: any) {
        console.error('Error loading financial report:', err);
        setError('Error al cargar el reporte financiero.');
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, []);

  const pieChartData = {
    labels: ['Ingresos por Productos', 'Ingresos por Suscripciones'],
    datasets: [
      {
        data: [reportData?.ingresos_productos || 0, reportData?.ingresos_suscripciones || 0],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
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
        text: 'Distribución de Ingresos',
        color: '#f8f8f8',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(context.parsed);
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

  const totalIncome = reportData?.total_ingresos || 0;
  const productIncome = reportData?.ingresos_productos || 0;
  const subscriptionIncome = reportData?.ingresos_suscripciones || 0;

  return (
    <div id="financial-report-content" className="bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-pink-600/20 rounded-lg">
          <Wallet size={24} className="text-pink-400" />
        </div>
        <h1 className="text-2xl font-black text-dashboard-text">REPORTE FINANCIERO CONSOLIDADO</h1>
        
      </div>

      {reportData === null ? (
        <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
          <div className="text-6xl mb-4">💰</div>
          <p className="text-dashboard-text text-xl font-black">No hay datos financieros para el reporte.</p>
          <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
            Verifica la base de datos o los rangos de fecha.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Tarjeta de Ingresos Totales */}
            <div className="bg-dashboard-bg p-6 rounded-xl border border-dashboard-accent/50 shadow-md flex items-center gap-4">
              <div className="p-3 bg-teal-600/20 rounded-lg">
                <DollarSign size={28} className="text-teal-400" />
              </div>
              <div>
                <p className="text-dashboard-text-secondary text-sm font-semibold">Ingresos Totales</p>
                <p className="text-3xl font-bold text-teal-400">{new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(totalIncome)}</p>
              </div>
            </div>

            {/* Tarjeta de Ingresos por Productos */}
            <div className="bg-dashboard-bg p-6 rounded-xl border border-dashboard-accent/50 shadow-md flex items-center gap-4">
              <div className="p-3 bg-purple-600/20 rounded-lg">
                <DollarSign size={28} className="text-purple-400" />
              </div>
              <div>
                <p className="text-dashboard-text-secondary text-sm font-semibold">Ingresos por Productos</p>
                <p className="text-3xl font-bold text-purple-400">{new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(productIncome)}</p>
              </div>
            </div>

            {/* Tarjeta de Ingresos por Suscripciones */}
            <div className="bg-dashboard-bg p-6 rounded-xl border border-dashboard-accent/50 shadow-md flex items-center gap-4">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <DollarSign size={28} className="text-blue-400" />
              </div>
              <div>
                <p className="text-dashboard-text-secondary text-sm font-semibold">Ingresos por Suscripciones</p>
                <p className="text-3xl font-bold text-blue-400">{new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(subscriptionIncome)}</p>
              </div>
            </div>
          </div>

          <div className="h-[400px] mb-8 flex justify-center items-center">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialReport;
