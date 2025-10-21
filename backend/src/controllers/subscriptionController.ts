// roshi_fit/backend/src/controllers/subscriptionController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

// Utilidad: suma días a una fecha (sin mutar el original)
const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// Utilidad: normaliza fecha a 00:00:00 local (para campos @db.Date)
const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// GET /api/subscriptions
// Lista la suscripción más reciente por usuario (cliente), con filtros y ordenamiento por días restantes
export const getLatestSubscriptionsPerUser = async (req: Request, res: Response) => {
  try {
    const { search, planId, estado, orderDays } = req.query as {
      search?: string;
      planId?: string;
      estado?: 'activa' | 'vencida' | 'cancelada' | 'suspendida';
      orderDays?: 'asc' | 'desc';
    };

    const today = startOfDay(new Date());

    // Construir where de forma dinámica, devolviendo SIEMPRE la última por usuario para el estado requerido
    let where: any = {
      ...(planId ? { plan_id: parseInt(planId) } : {}),
      usuarios_suscripciones_usuario_usuario_idTousuarios: {
        tipo_usuario: 'cliente',
        estado: 'activo',
      },
    };

    if (estado) {
      if (estado === 'vencida') {
        // Vencidas por fecha: incluir aunque la suscripción esté inactiva, para no perder históricos
        where = { ...where, fecha_fin: { lt: today } };
      } else if (estado === 'activa') {
        // Activas: deben estar activas y no vencidas por fecha
        where = { ...where, estado: 'activo', estado_suscripcion: 'activa', fecha_fin: { gte: today } };
      } else {
        // cancelada | suspendida: mantener estado 'activo' del registro
        where = { ...where, estado: 'activo', estado_suscripcion: estado };
      }
    } else {
      // Vista general: mantener solo registros activos por defecto
      where = { ...where, estado: 'activo' };
    }

    const raw = await prisma.suscripciones_usuario.findMany({
      where,
      orderBy: [
        { usuario_id: 'asc' },
        { fecha_inicio: 'desc' },
      ],
      distinct: ['usuario_id'],
      include: {
        usuarios_suscripciones_usuario_usuario_idTousuarios: {
          select: { id: true, nombre_completo: true, email: true, telefono: true }
        },
        planes_suscripcion: {
          select: { id: true, nombre: true, precio_q: true, duracion_dias: true }
        },
      },
    });

    // Mapear y calcular días restantes + estado calculado
    let data = raw.map((s) => {
      const fin = startOfDay(new Date(s.fecha_fin));
      const msDiff = fin.getTime() - today.getTime();
      const dias_restantes = Math.max(0, Math.floor(msDiff / (1000 * 60 * 60 * 24)));
      const computed_estado = fin.getTime() < today.getTime() ? 'vencida' : s.estado_suscripcion;

      return {
        id: s.id,
        usuario_id: s.usuario_id,
        plan_id: s.plan_id,
        fecha_inicio: s.fecha_inicio,
        fecha_fin: s.fecha_fin,
        estado_suscripcion: s.estado_suscripcion,
        dias_restantes,
        computed_estado,
        usuario: s.usuarios_suscripciones_usuario_usuario_idTousuarios,
        plan: s.planes_suscripcion,
      };
    });

    // Filtro por search (nombre o email) del lado del servidor (sobre el resultado ya agrupado por usuario)
    if (search && search.trim() !== '') {
      const term = search.trim().toLowerCase();
      data = data.filter((item) =>
        item.usuario.nombre_completo.toLowerCase().includes(term) ||
        item.usuario.email.toLowerCase().includes(term)
      );
    }

    // Ordenamiento por días restantes
    if (orderDays === 'asc') {
      data.sort((a, b) => a.dias_restantes - b.dias_restantes);
    } else if (orderDays === 'desc') {
      data.sort((a, b) => b.dias_restantes - a.dias_restantes);
    }

    res.json(data);
  } catch (error) {
    console.error('Error al listar suscripciones:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// PATCH /api/subscriptions/:id/extend { dias: number }
export const extendSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { dias } = req.body as { dias: number };

    const diasNum = parseInt(String(dias));
    if (!diasNum || diasNum <= 0) {
      return res.status(400).json({ message: 'El número de días debe ser mayor a 0.' });
    }

    const existing = await prisma.suscripciones_usuario.findUnique({ where: { id: parseInt(id) } });
    if (!existing || existing.estado !== 'activo') {
      return res.status(404).json({ message: 'Suscripción no encontrada o inactiva.' });
    }

    const newEnd = addDays(new Date(existing.fecha_fin), diasNum);

    const updated = await prisma.suscripciones_usuario.update({
      where: { id: parseInt(id) },
      data: { fecha_fin: startOfDay(newEnd) },
      select: { id: true, fecha_inicio: true, fecha_fin: true }
    });

    res.json({ message: 'Suscripción extendida.', suscripcion: updated });
  } catch (error) {
    console.error('Error al extender suscripción:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// PATCH /api/subscriptions/:id/cancel
export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.suscripciones_usuario.findUnique({ where: { id: parseInt(id) } });
    if (!existing || existing.estado !== 'activo') {
      return res.status(404).json({ message: 'Suscripción no encontrada o inactiva.' });
    }

    const updated = await prisma.suscripciones_usuario.update({
      where: { id: parseInt(id) },
      data: { estado_suscripcion: 'cancelada' },
      select: { id: true, estado_suscripcion: true }
    });

    res.json({ message: 'Suscripción cancelada.', suscripcion: updated });
  } catch (error) {
    console.error('Error al cancelar suscripción:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// POST /api/subscriptions/renew
// body: { usuario_id, plan_id, metodo_pago_id, detalles? }
export const renewSubscription = async (req: Request, res: Response) => {
  try {
    const { usuario_id, plan_id, metodo_pago_id, detalles } = req.body as {
      usuario_id: number;
      plan_id: number;
      metodo_pago_id: number;
      detalles?: any;
    };

    if (!usuario_id || !plan_id || !metodo_pago_id) {
      return res.status(400).json({ message: 'usuario_id, plan_id y metodo_pago_id son obligatorios.' });
    }

    const [user, plan, latest] = await Promise.all([
      prisma.usuarios.findUnique({ where: { id: Number(usuario_id) } }),
      prisma.planes_suscripcion.findUnique({ where: { id: Number(plan_id) } }),
      prisma.suscripciones_usuario.findFirst({
        where: { usuario_id: Number(usuario_id), estado: 'activo' },
        orderBy: { fecha_inicio: 'desc' },
      })
    ]);

    if (!user || user.tipo_usuario !== 'cliente' || user.estado !== 'activo') {
      return res.status(400).json({ message: 'Usuario inválido para renovación.' });
    }
    if (!plan || plan.estado !== 'activo') {
      return res.status(400).json({ message: 'Plan no válido para renovación.' });
    }

    const today = startOfDay(new Date());
    let startDate = today;
    if (latest) {
      const latestEnd = startOfDay(new Date(latest.fecha_fin));

      if (latest.estado_suscripcion === 'cancelada') {
        // Si la última fue cancelada, NO se suman días restantes; inicia hoy
        startDate = today;
      } else if (latestEnd.getTime() >= today.getTime()) {
        // Renovación antes de vencer: inicia el día siguiente al vencimiento actual
        startDate = addDays(latestEnd, 1);
      } else {
        // Ya venció: inicia hoy
        startDate = today;
      }
    }

    const endDate = addDays(startDate, plan.duracion_dias);

    const result = await prisma.$transaction(async (tx) => {
      // Marcar suscripción anterior como vencida si no estaba cancelada (si existe)
      if (latest && latest.estado_suscripcion !== 'cancelada') {
        await tx.suscripciones_usuario.update({
          where: { id: latest.id },
          data: { estado_suscripcion: 'vencida' },
        });
      }

      // Crear nueva suscripción
      const nueva = await tx.suscripciones_usuario.create({
        data: {
          usuario_id: Number(usuario_id),
          plan_id: Number(plan_id),
          fecha_inicio: startDate,
          fecha_fin: endDate,
          estado_suscripcion: 'activa',
          estado: 'activo',
        },
        select: { id: true, usuario_id: true, plan_id: true, fecha_inicio: true, fecha_fin: true }
      });

      // Registrar transacción de pago
      await tx.transacciones_pago.create({
        data: {
          orden_id: null,
          metodo_pago_id: Number(metodo_pago_id),
          monto_q: plan.precio_q,
          estado_transaccion: 'exitosa',
          detalles: detalles ? detalles : undefined,
          estado: 'activo',
        }
      });

      return nueva;
    });

    res.status(201).json({ message: 'Renovación exitosa.', suscripcion: result });
  } catch (error) {
    console.error('Error al renovar suscripción:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// GET /api/subscriptions/:userId/history
export const getUserSubscriptionHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.usuarios.findUnique({ where: { id: Number(userId) } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const history = await prisma.suscripciones_usuario.findMany({
      where: { usuario_id: Number(userId), estado: 'activo' },
      orderBy: { fecha_inicio: 'desc' },
      include: {
        planes_suscripcion: { select: { id: true, nombre: true, precio_q: true, duracion_dias: true } }
      }
    });

    res.json(history);
  } catch (error) {
    console.error('Error al obtener historial de suscripciones:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
