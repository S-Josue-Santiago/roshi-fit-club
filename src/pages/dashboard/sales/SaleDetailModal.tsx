// roshi_fit/src/pages/dashboard/sales/SaleDetailModal.tsx
import React, { useEffect, useState } from 'react';
import { fetchSaleDetail, fetchSaleInvoice } from '../../../api/salesApi';
import { X, User, CreditCard, Package, FileText, DollarSign, Calendar, MapPin, Phone, Mail, Activity } from 'lucide-react';

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

  const formatStatus = (estado: string) => {
    const statusMap: Record<string, { color: string; bg: string }> = {
      completada: { color: 'text-green-400', bg: 'bg-green-600/20' },
      pendiente: { color: 'text-yellow-400', bg: 'bg-yellow-600/20' },
      cancelada: { color: 'text-red-400', bg: 'bg-red-600/20' },
      pagada: { color: 'text-blue-400', bg: 'bg-blue-600/20' },
      enviada: { color: 'text-purple-400', bg: 'bg-purple-600/20' },
    };
    const status = statusMap[estado] || { color: 'text-gray-400', bg: 'bg-gray-600/20' };
    return (
      <span className={`${status.color} ${status.bg} px-3 py-1 rounded-full text-sm font-bold border border-current/30 capitalize`}>
        {estado}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-black p-6 rounded-2xl shadow-2xl w-full max-w-4xl border-2 border-dashboard-accent/50 max-h-[90vh] overflow-y-auto" 
        onClick={(e)=>e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashboard-accent/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <FileText size={24} className="text-purple-400" />
            </div>
            <h2 className="text-xl font-black text-dashboard-text">DETALLE DE VENTA</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-dashboard-text hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 transform hover:scale-110"
          >
            <X size={24} />
          </button>
        </div>

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

        {!loading && !error && data && (
          <div className="space-y-6 text-dashboard-text">
            {/* Información Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Información del Cliente */}
              <div className="bg-dashboard-accent/20 p-4 rounded-xl border border-dashboard-accent/50">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <User size={20} className="text-purple-400" />
                  INFORMACIÓN DEL CLIENTE
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-purple-400" />
                    <span className="font-semibold">
                      {data.usuarios_ordenes_usuario_idTousuarios?.nombre_completo || data.datos_consumidor_invitado?.nombre_completo || 'Cliente Invitado'}
                    </span>
                  </div>
                  {data.usuarios_ordenes_usuario_idTousuarios?.email || data.datos_consumidor_invitado?.email ? (
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-purple-400" />
                      <span>{data.usuarios_ordenes_usuario_idTousuarios?.email || data.datos_consumidor_invitado?.email}</span>
                    </div>
                  ) : null}
                  {data.usuarios_ordenes_usuario_idTousuarios?.telefono || data.datos_consumidor_invitado?.telefono ? (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-purple-400" />
                      <span>{data.usuarios_ordenes_usuario_idTousuarios?.telefono || data.datos_consumidor_invitado?.telefono}</span>
                    </div>
                  ) : null}
                  {data.usuarios_ordenes_usuario_idTousuarios?.direccion || data.datos_consumidor_invitado?.direccion ? (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-purple-400" />
                      <span>{data.usuarios_ordenes_usuario_idTousuarios?.direccion || data.datos_consumidor_invitado?.direccion}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Información de Pago */}
              <div className="bg-dashboard-accent/20 p-4 rounded-xl border border-dashboard-accent/50">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-purple-400" />
                  INFORMACIÓN DE PAGO
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-purple-400" />
                    <span className="font-semibold">Método:</span>
                    <span>{data.metodos_pago?.nombre || 'No especificado'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-purple-400" />
                    <span className="font-semibold">Estado:</span>
                    {formatStatus(data.estado_orden)}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-purple-400" />
                    <span className="font-semibold">Total:</span>
                    <span className="text-lg font-bold text-dashboard-primary">Q{data.total_q}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Productos */}
            <div className="bg-dashboard-accent/20 p-4 rounded-xl border border-dashboard-accent/50">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Package size={20} className="text-purple-400" />
                PRODUCTOS ({data.detalles_orden.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-dashboard-accent/30">
                  <thead className="bg-dashboard-accent/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-dashboard-text">PRODUCTO</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-dashboard-text">CANTIDAD</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-dashboard-text">PRECIO UNITARIO</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-dashboard-text">SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashboard-accent/20">
                    {data.detalles_orden.map((d: any, idx: number) => (
                      <tr key={idx} className="hover:bg-dashboard-accent/30 transition-colors duration-200">
                        <td className="px-4 py-3 text-sm">{d.productos?.nombre || 'Producto no disponible'}</td>
                        <td className="px-4 py-3 text-sm font-semibold">{d.cantidad}</td>
                        <td className="px-4 py-3 text-sm">Q{d.precio_unitario_q}</td>
                        <td className="px-4 py-3 text-sm font-bold text-dashboard-primary">Q{d.subtotal_q}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Factura */}
            {invoice && (
              <div className="bg-dashboard-accent/20 p-4 rounded-xl border border-dashboard-accent/50">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-purple-400" />
                  INFORMACIÓN DE FACTURA
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-purple-400" />
                    <div>
                      <div className="text-sm text-dashboard-text-secondary">Número</div>
                      <div className="font-semibold">{invoice.numero_factura}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-purple-400" />
                    <div>
                      <div className="text-sm text-dashboard-text-secondary">Fecha</div>
                      <div className="font-semibold">{new Date(invoice.fecha_emision).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-purple-400" />
                    <div>
                      <div className="text-sm text-dashboard-text-secondary">Total Factura</div>
                      <div className="font-semibold text-dashboard-primary">Q{invoice.total_q}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SaleDetailModal;