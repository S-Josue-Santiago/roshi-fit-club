// roshi_fit/src/pages/dashboard/sales/SalesList.tsx
import React, { useEffect, useState } from 'react';
import { fetchSales, fetchSaleInvoice, type SaleListItem } from '../../../api/salesApi';
import SalesFilters from './SalesFilters';
import SaleDetailModal from './SaleDetailModal';
import { Eye, Printer, Calendar, User, Hash, Package, DollarSign, CreditCard, Activity } from 'lucide-react';

const SalesList: React.FC = () => {
  const [items, setItems] = useState<SaleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ 
    search: '', 
    estado_orden: '' as any, 
    metodo_pago_id: '', 
    dateFrom: '', 
    dateTo: '' 
  });
  const [detailId, setDetailId] = useState<number | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchSales({
        search: filters.search || undefined,
        estado_orden: filters.estado_orden || undefined,
        metodo_pago_id: filters.metodo_pago_id || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
      });
      setItems(data);
    } catch (e) {
      setError('No se pudo cargar ventas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(); 
    /* eslint-disable-next-line */ 
  }, [filters.search, filters.estado_orden, filters.metodo_pago_id, filters.dateFrom, filters.dateTo]);

  const handleReprint = async (id: number) => {
    try {
      const invoice = await fetchSaleInvoice(id);
      const content = `Factura ${invoice.numero_factura}\nFecha: ${new Date(invoice.fecha_emision).toLocaleDateString()}\nTotal: Q${invoice.total_q}`;
      const win = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
      if (win) {
        win.document.write(`<pre>${content}</pre>`);
        win.document.close();
        win.focus();
        win.print();
        win.close();
      }
    } catch (e) {
      alert('No se pudo obtener la factura');
    }
  };

  const formatStatus = (estado: string) => {
    const statusMap: Record<string, { color: string; bg: string }> = {
      completado: { color: 'text-green-400', bg: 'bg-green-600/20' },
      pendiente: { color: 'text-yellow-400', bg: 'bg-yellow-600/20' },
      cancelado: { color: 'text-red-400', bg: 'bg-red-600/20' },
      procesando: { color: 'text-blue-400', bg: 'bg-blue-600/20' },
    };
    const status = statusMap[estado] || { color: 'text-gray-400', bg: 'bg-gray-600/20' };
    return (
      <span className={`${status.color} ${status.bg} px-3 py-1 rounded-full text-xs font-bold border border-current/30 capitalize`}>
        {estado}
      </span>
    );
  };

  return (
    <div className="bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-600/20 rounded-lg">
          <DollarSign size={24} className="text-purple-400" />
        </div>
        <h1 className="text-2xl font-black text-dashboard-text">VENTAS</h1>
      </div>

      <SalesFilters values={filters} onChange={setFilters} />

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dashboard-primary"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-600/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto mt-6">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden border border-dashboard-accent/50 rounded-lg bg-dashboard-accent/10">
              <table className="min-w-full divide-y divide-dashboard-accent/30">
                <thead className="bg-dashboard-accent/50">
                  <tr>
                    <th scope="col" className="px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2">
                        <Hash size={16} className="text-purple-400" />
                        ORDEN
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-purple-400" />
                        CLIENTE
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-purple-400" />
                        PRODUCTOS
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-purple-400" />
                        TOTAL
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-purple-400" />
                        MÉTODO
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2">
                        <Activity size={16} className="text-purple-400" />
                        ESTADO
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-purple-400" />
                        FECHA
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-black text-dashboard-text uppercase tracking-wider">
                      ACCIONES
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashboard-accent/20">
                  {items.map((s) => (
                    <tr 
                      key={s.id} 
                      className="transition-all duration-300 hover:bg-black hover:bg-opacity-80  hover:shadow-2xl group bg-dashboard-accent/5"
                    >
                      <td className="px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-dashboard-text font-bold group-hover:text-white border-r border-dashboard-accent/30">
                        #{s.orden_numero}
                      </td>
                      <td className="px-3 py-4 sm:px-4 sm:py-4 text-xs sm:text-sm border-r border-dashboard-accent/30">
                        <div className="font-semibold text-dashboard-text group-hover:text-white">{s.cliente_nombre}</div>
                        <div className="text-xs text-dashboard-text-secondary group-hover:text-gray-300">{s.cliente_email}</div>
                      </td>
                      <td className="px-3 py-4 sm:px-4 sm:py-4 text-xs sm:text-sm text-dashboard-text-secondary group-hover:text-white border-r border-dashboard-accent/30 max-w-xs">
                        <div className="line-clamp-2">{s.productos_resumen}</div>
                      </td>
                      <td className="px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-dashboard-text font-bold group-hover:text-white border-r border-dashboard-accent/30">
                        Q{s.total_q}
                      </td>
                      <td className="px-3 py-4 sm:px-4 sm:py-4 text-xs sm:text-sm text-dashboard-text group-hover:text-white border-r border-dashboard-accent/30">
                        {s.metodo_pago}
                      </td>
                      <td className="px-3 py-4 sm:px-4 sm:py-4 text-xs sm:text-sm border-r border-dashboard-accent/30">
                        {formatStatus(s.estado_orden)}
                      </td>
                      <td className="px-3 py-4 sm:px-4 sm:py-4 text-xs sm:text-sm text-dashboard-text-secondary group-hover:text-white border-r border-dashboard-accent/30">
                        {s.creacion_fecha ? new Date(s.creacion_fecha).toLocaleString() : '-'}
                      </td>

                      <td className="px-3 py-4 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setDetailId(s.id)} 
                            className="
                              px-3 py-2 bg-blue-600 text-white rounded-lg
                              hover:bg-blue-700 border border-blue-600
                              transition-all duration-300 transform hover:scale-110
                              flex items-center gap-1 group/btn font-semibold
                              shadow-md hover:shadow-lg
                            "
                          >
                            <Eye size={14} />
                            <span className="hidden sm:inline">Ver</span>
                          </button>
                          <button 
                            onClick={() => handleReprint(s.id)} 
                            className="
                              px-3 py-2 bg-gray-700 text-white rounded-lg
                              hover:bg-gray-800 border border-gray-600
                              transition-all duration-300 transform hover:scale-110
                              flex items-center gap-1 group/btn font-semibold
                              shadow-md hover:shadow-lg
                            "
                          >
                            <Printer size={14} />
                            <span className="hidden sm:inline">Factura</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {items.length === 0 && !loading && (
            <div className="text-center py-12 bg-dashboard-accent/20 rounded-lg border border-dashboard-accent/50 mt-6">
              <div className="text-6xl mb-4">💰</div>
              <p className="text-dashboard-text text-xl font-black">No se encontraron ventas</p>
              <p className="text-dashboard-text-secondary mt-2 text-base font-medium">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          )}
        </div>
      )}

      {detailId !== null && (
        <SaleDetailModal saleId={detailId} onClose={() => setDetailId(null)} />
      )}
    </div>
  );
};

export default SalesList;