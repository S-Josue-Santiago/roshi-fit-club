// roshi_fit/src/pages/dashboard/client/account/ClientPurchaseHistory.tsx
import React, { useEffect, useState } from 'react';
import { fetchClientOrders, fetchSaleInvoice } from '../../../../api/salesApi';
import { type SaleListItem } from '../../../../types/Sale';
import SaleDetailModal from '../../sales/SaleDetailModal';
import { 
  Eye, 
  Printer, 
  Hash, 
  Package, 
  DollarSign, 
  CreditCard, 
  Calendar 
} from 'lucide-react';

const ClientPurchaseHistory: React.FC = () => {
  const [items, setItems] = useState<SaleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const userData = localStorage.getItem('userData');
        if (!userData) return;
        
        const user = JSON.parse(userData);
        const data = await fetchClientOrders(user.id);
        setItems(data);
      } catch (e) {
        setError('No se pudo cargar el historial de compras');
        console.error('Error al cargar historial:', e);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleReprint = async (id: number) => {
    try {
      const invoice = await fetchSaleInvoice(id);
      const content = `Factura ${invoice.numero_factura}
Fecha: ${new Date(invoice.fecha_emision).toLocaleDateString()}
Total: Q${invoice.total_q}`;
      const win = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
      if (win) {
        win.document.write(`<pre>${content}</pre>`);
        win.document.close();
        win.focus();
        win.print();
        win.close();
      }
    } catch (e) {
      console.error('Error al imprimir factura:', e);
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
    <div className="bg-dashboard-accent/30 p-4 sm:p-6 rounded-xl border border-dashboard-accent">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-600/20 rounded-lg">
          <DollarSign size={24} className="text-purple-400" />
        </div>
        <h1 className="text-2xl font-black text-dashboard-text">HISTORIAL DE COMPRAS</h1>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dashboard-primary"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-600/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6">
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
                    <th scope="col" className="px-3 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2">
                        <Hash size={16} className="text-purple-400" />
                        ORDEN
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-purple-400" />
                        PRODUCTOS
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-purple-400" />
                        TOTAL
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-purple-400" />
                        MÉTODO
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-purple-400" />
                        FECHA
                      </div>
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider border-r border-dashboard-accent/30">
                      ESTADO
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-black text-dashboard-text uppercase tracking-wider">
                      ACCIONES
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashboard-accent/20">
                  {items.map((order) => (
                    <tr key={order.id} className="hover:bg-dashboard-accent/20">
                      <td className="px-3 py-4 text-xs font-bold text-dashboard-text border-r border-dashboard-accent/30">
                        {order.orden_numero}
                      </td>
                      <td className="px-3 py-4 text-xs text-dashboard-text-secondary max-w-xs border-r border-dashboard-accent/30">
                        <div className="line-clamp-2">{order.productos_resumen}</div>
                      </td>
                      <td className="px-3 py-4 text-xs font-bold text-dashboard-text border-r border-dashboard-accent/30">
                        Q{order.total_q}
                      </td>
                      <td className="px-3 py-4 text-xs text-dashboard-text border-r border-dashboard-accent/30">
                        {order.metodo_pago}
                      </td>
                      <td className="px-3 py-4 text-xs text-dashboard-text-secondary border-r border-dashboard-accent/30">
                        {order.creacion_fecha ? new Date(order.creacion_fecha).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-3 py-4 text-xs border-r border-dashboard-accent/30">
                        {formatStatus(order.estado_orden)}
                      </td>
                      <td className="px-3 py-4 text-xs">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setDetailId(order.id)} 
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 border border-blue-600 transition-all duration-300 transform hover:scale-110 flex items-center gap-1 group/btn font-semibold shadow-md hover:shadow-lg"
                          >
                            <Eye size={14} />
                            <span className="hidden sm:inline">Ver</span>
                          </button>
                          <button 
                            onClick={() => handleReprint(order.id)} 
                            className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 border border-gray-600 transition-all duration-300 transform hover:scale-110 flex items-center gap-1 group/btn font-semibold shadow-md hover:shadow-lg"
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
          {items.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dashboard-text">No tienes compras registradas.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de detalle */}
      {detailId !== null && (
        <SaleDetailModal 
          saleId={detailId} 
          onClose={() => setDetailId(null)} 
        />
      )}
    </div>
  );
};

export default ClientPurchaseHistory;