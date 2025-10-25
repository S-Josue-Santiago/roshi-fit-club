// roshi_fit/src/pages/dashboard/reports/ReportList.tsx
import React, { useState, useEffect } from 'react';
import {
  fetchSubscriptionReport,
  fetchProductReport,
  fetchUserReport,
  fetchClassReport,
  fetchEquipmentReport
} from '../../../api/reportApi';
import ReportFilters from './ReportFilters';
import ReportCard from './ReportCard';
import ReportDetail from './ReportDetail';

const ReportList: React.FC = () => {
  const [, setSearchTerm] = useState(''); // Fix: Removed 'searchTerm' from destructuring as its value is not read
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState({
    sales: 'Q0.00',
    topProduct: '—',
    newUsers: '0',
    attendance: '0%',
    maintenance: '0'
  });
  const [activeReport, setActiveReport] = useState<string | null>(null);

  useEffect(() => {
    const loadKpis = async () => {
      setLoading(true);
      try {
        const [subs, products, users, classes, equipment] = await Promise.all([
          fetchSubscriptionReport(),
          fetchProductReport(),
          fetchUserReport(),
          fetchClassReport(),
          fetchEquipmentReport()
        ]);

        const totalSales = subs.reduce((sum, s) => sum + Number(s.ingresos), 0);
        const topProduct = products.length > 0 ? products[0].nombre : '—';
        const newUsers = users.nuevos.reduce((sum, d) => sum + d.nuevos, 0);
        const avgAttendance = classes.length > 0 
          ? (classes.reduce((sum, c) => sum + c.tasa_asistencia, 0) / classes.length).toFixed(1) + '%'
          : '0%';
        const maintenanceCount = equipment.filter(e => e.estado_revision !== 'Al día').length;

        setKpiData({
          sales: `Q${totalSales.toFixed(2)}`,
          topProduct,
          newUsers: newUsers.toString(),
          attendance: avgAttendance,
          maintenance: maintenanceCount.toString()
        });
      } catch (error) {
        console.error('Error al cargar KPIs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadKpis();
  }, [period]);

  const handleSearchChange = (term: string) => setSearchTerm(term);
  const handlePeriodChange = (period: string) => setPeriod(period);

  const reports = [
    { icon: '💰', title: 'Ventas Hoy', value: kpiData.sales, key: 'sales' },
    { icon: '📦', title: 'Producto Más Vendido', value: kpiData.topProduct, key: 'product' },
    { icon: '👥', title: 'Nuevos Usuarios', value: kpiData.newUsers, key: 'users' },
    { icon: '🧘', title: 'Asistencia', value: kpiData.attendance, key: 'attendance' },
    { icon: '🔧', title: 'Equipos en Mantenimiento', value: kpiData.maintenance, key: 'maintenance' }
  ];

  return (
    <div className="bg-dashboard-accent/30 p-6 rounded-xl border border-dashboard-accent">
      <ReportFilters onSearchChange={handleSearchChange} onPeriodChange={handlePeriodChange} />

      {loading ? (
        <p className="text-dashboard-text py-6 text-center">Cargando reportes...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-6">
          {reports.map(report => (
            <ReportCard
              key={report.key}
              icon={report.icon}
              title={report.title}
              value={report.value}
              onClick={() => {
                const reportMap: Record<string, string> = {
                  sales: 'subscriptions',
                  product: 'products',
                  users: 'users',
                  attendance: 'classes',
                  maintenance: 'equipment'
                };
                setActiveReport(reportMap[report.key]);
              }}
            />
          ))}
        </div>
      )}

      {/* Categorías */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-dashboard-text mb-4">Categorías de Reportes</h3>
        <div className="flex flex-wrap gap-3">
          {['Financiero', 'Productos', 'Usuarios', 'Clases', 'Entrenamiento', 'Equipos', 'Sistema', 'Promociones', 'Consolidado'].map(cat => (
            <button
              key={cat}
              className="px-4 py-2 bg-dashboard-primary/20 text-dashboard-text rounded-lg hover:bg-dashboard-primary/40 transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Modal de reporte detallado */}
      {activeReport && (
        <ReportDetail
          reportType={activeReport}
          onClose={() => setActiveReport(null)}
        />
      )}
    </div>
  );
};

export default ReportList;