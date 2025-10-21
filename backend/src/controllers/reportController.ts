// roshi_fit/backend/src/controllers/reportController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';
interface ActiveUsersResult {
  activos: number;
}
// 1. Reporte de Suscripciones
export const getSubscriptionReport = async (_req: Request, res: Response) => {
  try {
    const report = await prisma.$queryRaw`
      SELECT 
        p.nombre AS plan,
        COUNT(su.id) AS nuevas,
        SUM(CASE WHEN su.estado_suscripcion = 'activa' THEN 1 ELSE 0 END) AS activas,
        SUM(p.precio_q) AS ingresos
      FROM suscripciones_usuario su
      JOIN planes_suscripcion p ON su.plan_id = p.id
      WHERE su.creacion_fecha >= NOW() - INTERVAL 30 DAY
      GROUP BY p.id, p.nombre;
    `;
    res.json(report);
  } catch (error) {
    console.error('Error en reporte de suscripciones:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 2. Reporte de Productos
export const getProductReport = async (_req: Request, res: Response) => {
  try {
const report = await prisma.$queryRaw`
  SELECT 
    pr.nombre,
    CAST(SUM(do.cantidad) AS SIGNED) AS unidades,
    CAST(SUM(do.subtotal_q) AS DECIMAL(10,2)) AS ingresos
  FROM productos pr
  JOIN detalles_orden do ON pr.id = do.producto_id
  JOIN ordenes o ON do.orden_id = o.id
  WHERE o.estado_orden = 'pagada'
    AND o.creacion_fecha >= NOW() - INTERVAL 30 DAY
  GROUP BY pr.id
  ORDER BY unidades DESC
  LIMIT 10;
`;
    res.json(report);
  } catch (error) {
    console.error('Error en reporte de productos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 3. Reporte de Usuarios
export const getUserReport = async (_req: Request, res: Response) => {
  try {
    const nuevos = await prisma.$queryRaw`
      SELECT 
        DATE(creacion_fecha) AS dia,
        COUNT(*) AS nuevos
      FROM usuarios
      WHERE creacion_fecha >= NOW() - INTERVAL 30 DAY
      GROUP BY DATE(creacion_fecha)
      ORDER BY dia;
    `;

    const activos = await prisma.$queryRaw<ActiveUsersResult[]>`
      SELECT COUNT(DISTINCT usuario_id) AS activos
      FROM suscripciones_usuario
      WHERE fecha_fin >= CURDATE() 
        AND estado_suscripcion = 'activa';
    `;


    res.json({ nuevos, activos: activos[0]?.activos || 0 });
  } catch (error) {
    console.error('Error en reporte de usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 4. Reporte de Clases
export const getClassReport = async (_req: Request, res: Response) => {
  try {
    const report = await prisma.$queryRaw`
      SELECT 
        cg.nombre AS clase,
        COUNT(rc.id) AS reservas,
        SUM(CASE WHEN rc.asistio = TRUE THEN 1 ELSE 0 END) AS asistentes,
        ROUND(AVG(CASE WHEN rc.asistio = TRUE THEN 100.0 ELSE 0 END), 1) AS tasa_asistencia
      FROM clases_grupales cg
      JOIN reservas_clases rc ON cg.id = rc.clase_id
      WHERE rc.fecha_reserva >= CURDATE() - INTERVAL 30 DAY
      GROUP BY cg.id
      ORDER BY tasa_asistencia DESC;
    `;
    res.json(report);
  } catch (error) {
    console.error('Error en reporte de clases:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 5. Reporte de Equipos
export const getEquipmentReport = async (_req: Request, res: Response) => {
  try {
    const report = await prisma.$queryRaw`
      SELECT 
        nombre,
        estado_equipo,
        proxima_revision,
        CASE 
          WHEN proxima_revision < CURDATE() THEN 'Vencida'
          WHEN proxima_revision <= CURDATE() + INTERVAL 7 DAY THEN 'Próxima'
          ELSE 'Al día'
        END AS estado_revision
      FROM equipos
      WHERE estado = 'activo';
    `;
    res.json(report);
  } catch (error) {
    console.error('Error en reporte de equipos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};