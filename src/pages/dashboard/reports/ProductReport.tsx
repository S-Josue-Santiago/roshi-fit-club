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
} from 'chart.js/auto';
import { fetchProductReport } from '../../../api/reportApi';
import type { ProductReportData } from '../../../types/Report';
import { Package, AlertTriangle } from 'lucide-react';
// import { generatePdf } from '../../../utils/reportPdfGenerator'; // Import the utility function

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProductReport: React.FC = () => {
  const [reportData, setReportData] = useState<ProductReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const data = await fetchProductReport();
        setReportData(data);
      } catch (err: any) {
        console.error('Error loading product report:', err);
        setError('Error al cargar el reporte de productos.');
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, []);

  const chartData = {
    labels: reportData.map(d => d.nombre),
    datasets: [
      {
        label: 'Unidades Vendidas',
        data: reportData.map(d => d.unidades),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
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
        text: 'Top 10 Productos Vendidos (Últimos 30 Días)',
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
            if (context.parsed.x !== null) {
              label += new Intl.NumberFormat('es-GT').format(context.parsed.x);
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

  // Example for low stock alert (you'd need actual stock data for this)
  const lowStockProducts = reportData.filter(item => item.unidades < 5); // Assuming 5 is the low stock threshold

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
    <div id="product-report-content" className="bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-600/20 rounded-lg">
          <Package size={24} className="text-purple-400" />
        </div>
        <h1 className="text-2xl font-black text-dashboard-text">REPORTE DE PRODUCTOS</h1>
        
      </div>

      {reportData.length === 0 ? (
        <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-dashboard-text text-xl font-black">No hay datos de productos para el reporte.</p>
          <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
            Intenta verificar la base de datos o los filtros de fecha.
          </p>
        </div>
      ) : (
        <>
          {lowStockProducts.length > 0 && (
            <div className="bg-red-600/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-400" />
              <p className="font-semibold">Alerta de Stock Bajo:</p>
              <ul className="list-disc list-inside ml-2">
                {lowStockProducts.map(p => (
                  <li key={p.nombre}>{p.nombre} ({p.unidades} unidades vendidas)</li>
                ))}
              </ul>
            </div>
          )}

          <div className="h-[400px] mb-8">
            <Bar data={chartData} options={options} />
          </div>

          <h3 className="text-xl font-black text-dashboard-text mb-4 border-b border-dashboard-accent/50 pb-2">Detalle por Producto</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dashboard-accent/30 bg-dashboard-accent/10 rounded-lg">
              <thead className="bg-dashboard-accent/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">Producto</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">Unidades Vendidas</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider">Ingresos Generados</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashboard-accent/20">
                {reportData.map((item, index) => (
                  <tr key={index} className="hover:bg-black hover:bg-opacity-80 transition-all duration-300">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-dashboard-text border-r border-dashboard-accent/30">{item.nombre}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-dashboard-text-secondary border-r border-dashboard-accent/30">{item.unidades}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-purple-400">{new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(item.ingresos)}</td>
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

export default ProductReport;
