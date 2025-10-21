// roshi_fit/src/pages/dashboard/sales/SalesList.tsx
import React, { useEffect, useState } from 'react';
import { fetchSales, fetchSaleInvoice, type SaleListItem } from '../../../api/salesApi';
import SalesFilters from './SalesFilters';
import SaleDetailModal from './SaleDetailModal';

const SalesList: React.FC = () => {
  const [items, setItems] = useState<SaleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({ search: '', estado_orden: '' as any, metodo_pago_id: '' , dateFrom: '', dateTo: '' });

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

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filters.search, filters.estado_orden, filters.metodo_pago_id, filters.dateFrom, filters.dateTo]);

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-dashboard-text mb-4">Ventas</h1>

      <SalesFilters values={filters} onChange={setFilters} />

      {loading && <div className="text-dashboard-text">Cargando...</div>}
      {error && <div className="bg-red-800/50 text-red-200 p-2 rounded mb-4">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-dashboard-text-secondary border-b border-dashboard-accent">
                <th className="py-2">Orden</th>
                <th className="py-2">Cliente</th>
                <th className="py-2">Productos</th>
                <th className="py-2">Total</th>
                <th className="py-2">Método</th>
                <th className="py-2">Estado</th>
                <th className="py-2">Fecha</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-dashboard-text">
              {items.map((s) => (
                <tr key={s.id} className="border-b border-dashboard-accent/40">
                  <td className="py-2">{s.orden_numero}</td>
                  <td className="py-2">
                    <div className="font-semibold">{s.cliente_nombre}</div>
                    <div className="text-xs text-dashboard-text-secondary">{s.cliente_email}</div>
                  </td>
                  <td className="py-2">{s.productos_resumen}</td>
                  <td className="py-2">Q{s.total_q}</td>
                  <td className="py-2">{s.metodo_pago}</td>
                  <td className="py-2 capitalize">{s.estado_orden}</td>
                  <td className="py-2">{s.creacion_fecha ? new Date(s.creacion_fecha).toLocaleString() : '-'}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button onClick={() => setDetailId(s.id)} className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded">Ver</button>
                      <button onClick={() => handleReprint(s.id)} className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded">Reimprimir Factura</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detailId !== null && (
        <SaleDetailModal saleId={detailId} onClose={() => setDetailId(null)} />
      )}
    </div>
  );
};

export default SalesList;
