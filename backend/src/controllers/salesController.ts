// roshi_fit/backend/src/controllers/salesController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

// Utilidad de rango de fechas a 00:00 local
const startOfDay = (date: Date) => { const d = new Date(date); d.setHours(0,0,0,0); return d; };
const endOfDay = (date: Date) => { const d = new Date(date); d.setHours(23,59,59,999); return d; };

// GET /api/sales
// Lista de ventas (ordenes) con filtros: search (cliente/email), estado_orden, metodo_pago_id, dateFrom, dateTo
export const listSales = async (req: Request, res: Response) => {
  try {
    const { search, estado_orden, metodo_pago_id, dateFrom, dateTo } = req.query as {
      search?: string;
      estado_orden?: 'pendiente' | 'pagada' | 'enviada' | 'cancelada' | 'completada';
      metodo_pago_id?: string;
      dateFrom?: string;
      dateTo?: string;
    };

    const where: any = { estado: 'activo' };

    if (estado_orden) where.estado_orden = estado_orden;
    if (metodo_pago_id) where.metodo_pago_id = parseInt(metodo_pago_id);

    if (dateFrom || dateTo) {
      where.creacion_fecha = {};
      if (dateFrom) (where.creacion_fecha as any).gte = startOfDay(new Date(dateFrom));
      if (dateTo) (where.creacion_fecha as any).lte = endOfDay(new Date(dateTo));
    }

    // Búsqueda: por nombre/email de usuario o invitado, o por número de factura
    // Nota: número de factura está en facturas, por lo que haremos filtro en memoria tras incluir
    const orders = await prisma.ordenes.findMany({
      where,
      orderBy: { creacion_fecha: 'desc' },
      include: {
        usuarios_ordenes_usuario_idTousuarios: { select: { id: true, nombre_completo: true, email: true } },
        datos_consumidor_invitado: { select: { id: true, nombre_completo: true, email: true } },
        metodos_pago: { select: { id: true, nombre: true } },
        detalles_orden: { select: { cantidad: true, subtotal_q: true, productos: { select: { id: true, nombre: true } } } },
        facturas: { select: { id: true, numero_factura: true, fecha_emision: true, total_q: true }, orderBy: { fecha_emision: 'desc' }, take: 1 },
      }
    });

    let data = orders.map((o) => {
      const clienteNombre = o.usuarios_ordenes_usuario_idTousuarios?.nombre_completo || o.datos_consumidor_invitado?.nombre_completo || 'Invitado';
      const clienteEmail = o.usuarios_ordenes_usuario_idTousuarios?.email || o.datos_consumidor_invitado?.email || '';
      const productosResumen = o.detalles_orden.map(d => `${d.productos?.nombre || 'Producto'} (${d.cantidad})`).join(', ');
      const factura = (o.facturas && o.facturas.length > 0) ? o.facturas[0] : null;
      return {
        id: o.id,
        orden_numero: factura?.numero_factura || `#${o.id}`,
        cliente_nombre: clienteNombre,
        cliente_email: clienteEmail,
        productos_resumen: productosResumen,
        total_q: o.total_q,
        metodo_pago: o.metodos_pago?.nombre || '-',
        estado_orden: o.estado_orden,
        creacion_fecha: o.creacion_fecha,
        factura,
      };
    });

    if (search && search.trim() !== '') {
      const term = search.trim().toLowerCase();
      data = data.filter(item =>
        item.cliente_nombre.toLowerCase().includes(term) ||
        item.cliente_email.toLowerCase().includes(term) ||
        item.orden_numero.toLowerCase().includes(term)
      );
    }

    res.json(data);
  } catch (error) {
    console.error('Error al listar ventas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// GET /api/sales/:id
export const getSaleDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sale = await prisma.ordenes.findUnique({
      where: { id: parseInt(id) },
      include: {
        usuarios_ordenes_usuario_idTousuarios: { select: { id: true, nombre_completo: true, email: true, telefono: true, direccion: true } },
        datos_consumidor_invitado: { select: { id: true, nombre_completo: true, email: true, telefono: true, direccion: true } },
        metodos_pago: { select: { id: true, nombre: true } },
        detalles_orden: { select: { cantidad: true, precio_unitario_q: true, subtotal_q: true, productos: { select: { id: true, nombre: true } } } },
        facturas: { include: { facturas_detalle: true }, orderBy: { fecha_emision: 'desc' }, take: 1 },
        transacciones_pago_transacciones_pago_orden_idToordenes: { select: { id: true, estado_transaccion: true, monto_q: true, referencia_externa: true, detalles: true, creacion_fecha: true, metodos_pago: { select: { nombre: true } } } }
      }
    });

    if (!sale) return res.status(404).json({ message: 'Venta no encontrada.' });

    res.json(sale);
  } catch (error) {
    console.error('Error al obtener detalle de venta:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// GET /api/sales/:id/invoice
export const getSaleInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await prisma.facturas.findFirst({
      where: { orden_id: parseInt(id), estado: 'activo' },
      include: { facturas_detalle: true }
    });

    if (!invoice) return res.status(404).json({ message: 'Factura no encontrada.' });

    res.json(invoice);
  } catch (error) {
    console.error('Error al obtener factura:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
