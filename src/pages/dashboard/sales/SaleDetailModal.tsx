// roshi_fit/src/pages/dashboard/sales/SaleDetailModal.tsx
import React, { useEffect, useState } from 'react';
import { fetchSaleDetail, fetchSaleInvoice } from '../../../api/salesApi';

interface Props {
  saleId: number;
  onClose: () => void;
}

const SaleDetailModal: React.FC<Props> = ({ saleId, onClose }) => {
  const [data, setData] = useState<any>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [d, i] = await Promise.all([
          fetchSaleDetail(saleId),
          fetchSaleInvoice(saleId).catch(()=>null)
        ]);
        setData(d);
        setInvoice(i);
      } catch (e) {
        setError('No se pudo cargar la venta');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [saleId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-dashboard-accent/90 p-6 rounded-xl shadow-2xl w-full max-w-4xl border border-dashboard-accent" onClick={(e)=>e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 border-b border-dashboard-accent pb-2">
          <h2 className="text-xl font-bold text-dashboard-text">Detalle de Venta</h2>
          <button onClick={onClose} className="text-dashboard-text hover:text-dashboard-primary text-2xl">&times;</button>
        </div>

        {loading && <div className="text-dashboard-text">Cargando...</div>}
        {error && <div className="bg-red-800/50 text-red-200 p-2 rounded mb-4">{error}</div>}

        {!loading && !error && data && (
          <div className="space-y-4 text-dashboard-text">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-1">Cliente</h3>
                <div>{data.usuarios_ordenes_usuario_idTousuarios?.nombre_completo || data.datos_consumidor_invitado?.nombre_completo || 'Invitado'}</div>
                <div className="text-sm text-dashboard-text-secondary">{data.usuarios_ordenes_usuario_idTousuarios?.email || data.datos_consumidor_invitado?.email || ''}</div>
                <div className="text-sm">{data.usuarios_ordenes_usuario_idTousuarios?.telefono || data.datos_consumidor_invitado?.telefono || ''}</div>
                <div className="text-sm">{data.usuarios_ordenes_usuario_idTousuarios?.direccion || data.datos_consumidor_invitado?.direccion || ''}</div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Pago</h3>
                <div>Método: {data.metodos_pago?.nombre || '-'}</div>
                <div>Estado: {data.estado_orden}</div>
                <div>Total: Q{data.total_q}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Productos</h3>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-dashboard-text-secondary border-b border-dashboard-accent">
                    <th className="py-2">Producto</th>
                    <th className="py-2">Cantidad</th>
                    <th className="py-2">Precio</th>
                    <th className="py-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {data.detalles_orden.map((d: any, idx: number) => (
                    <tr key={idx} className="border-b border-dashboard-accent/40">
                      <td className="py-2">{d.productos?.nombre}</td>
                      <td className="py-2">{d.cantidad}</td>
                      <td className="py-2">Q{d.precio_unitario_q}</td>
                      <td className="py-2">Q{d.subtotal_q}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {invoice && (
              <div>
                <h3 className="font-semibold mb-1">Factura</h3>
                <div>Número: {invoice.numero_factura}</div>
                <div>Fecha: {new Date(invoice.fecha_emision).toLocaleDateString()}</div>
                <div>Total: Q{invoice.total_q}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SaleDetailModal;
