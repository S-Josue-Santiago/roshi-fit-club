// roshi_fit/backend/src/controllers/reportController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';
interface ActiveUsersResult {
  activos: number;
}
interface SubscriptionReportRawResult {
  plan: string;
  nuevas: bigint;
  activas: bigint;
  ingresos: string;
}

interface ProductReportRawResult {
  nombre: string;
  unidades: bigint;
  ingresos: string;
}

interface UserNewRawResult {
  dia: Date;
  nuevos: bigint;
}

interface ClassReportRawResult {
  clase: string;
  reservas: bigint;
  asistentes: bigint;
  tasa_asistencia: string;
}

interface EquipmentReportRawResult {
  nombre: string;
  estado_equipo: string;
  proxima_revision: Date | null;
  estado_revision: string;
}

interface TrainingSessionByTrainerRawResult {
  nombre_completo: string;
  sesiones: bigint;
}

interface TrainingEvaluationRawResult {
  dia: Date;
  evaluaciones: bigint;
}

interface SystemActivityReportRawResult {
  accion: string;
  frecuencia: bigint;
}

interface FinancialReportIncomeRawResult {
  ingresos_productos?: string;
  ingresos_suscripciones?: string;
}

// 1. Reporte de Suscripciones
export const getSubscriptionReport = async (req: Request, res: Response) => {
  try {
    const report: SubscriptionReportRawResult[] = await prisma.$queryRaw`
      SELECT
          p.nombre AS plan,
          COUNT(su.id) AS nuevas,
          SUM(CASE WHEN su.estado_suscripcion = 'activa' THEN 1 ELSE 0 END) AS activas,
          SUM(p.precio_q) AS ingresos
      FROM suscripciones_usuario su
      JOIN planes_suscripcion p ON su.plan_id = p.id
      WHERE su.creacion_fecha >= CURDATE() - INTERVAL 30 DAY
      GROUP BY p.id, p.nombre;
    `;

    console.log('Raw Subscription Report:', report); // Added logging

    // Convert BigInt to number and Decimal string to float
    const processedReport = report.map(item => ({
      plan: item.plan,
      nuevas: Number(item.nuevas),
      activas: Number(item.activas),
      ingresos: parseFloat(item.ingresos), // Parse string to float
    }));

    res.status(200).json(processedReport);
  } catch (error) {
    console.error('Error fetching subscription report:', error); // Detailed error logging
    res.status(500).json({ message: 'Error interno del servidor al generar reporte de suscripciones.' });
  }
};

// 2. Reporte de Productos
export const getProductReport = async (_req: Request, res: Response) => {
  try {
    const report: ProductReportRawResult[] = await prisma.$queryRaw`
      SELECT 
          pr.nombre,
          CAST(SUM(do.cantidad) AS SIGNED) AS unidades,
          CAST(SUM(do.subtotal_q) AS DECIMAL(10,2)) AS ingresos
      FROM productos pr
      JOIN detalles_orden do ON pr.id = do.producto_id
      JOIN ordenes o ON do.orden_id = o.id
      WHERE o.estado_orden = 'pagada'
        AND o.creacion_fecha >= CURDATE() - INTERVAL 30 DAY
      GROUP BY pr.id, pr.nombre
      ORDER BY unidades DESC
      LIMIT 10;
    `;

    console.log('Raw Product Report:', report); // Added logging

    const processedReport = report.map(item => ({
      nombre: item.nombre,
      unidades: Number(item.unidades),
      ingresos: parseFloat(item.ingresos),
    }));

    res.json(processedReport);
  } catch (error) {
    console.error('Error fetching product report:', error); // Detailed error logging
    res.status(500).json({ message: 'Error interno del servidor al generar reporte de productos.' });
  }
};

// 3. Reporte de Usuarios
export const getUserReport = async (_req: Request, res: Response) => {
  try {
    const nuevos: { dia: Date; nuevos: string }[] = await prisma.$queryRaw`
      SELECT 
          DATE(creacion_fecha) AS dia,
          CAST(COUNT(*) AS DECIMAL(10, 0)) AS nuevos
      FROM usuarios
      WHERE creacion_fecha >= CURDATE() - INTERVAL 30 DAY
      GROUP BY DATE(creacion_fecha)
      ORDER BY dia;
    `;
    console.log('Raw New Users Report (nuevos):', nuevos);

    // // Query for active users
    // const activosRaw: { activos: string }[] = await prisma.$queryRaw`
    //   SELECT CAST(COUNT(DISTINCT usuario_id) AS DECIMAL(10, 0)) AS activos
    //   FROM suscripciones_usuario
    //   WHERE fecha_fin >= CURDATE() 
    //     AND estado_suscripcion = 'activa';
    // `;
    // console.log('Raw Active Users Report (activosRaw):', activosRaw);

    const processedNuevos = nuevos.map(item => ({
      dia: item.dia.toISOString().split('T')[0], // Format date to YYYY-MM-DD
      nuevos: parseFloat(item.nuevos), // Parse string to float
    }));

    const activos = 0; // Temporarily set activos to 0

    console.log('Processed New Users:', processedNuevos);
    console.log('Processed Active Users:', activos);

    res.json({ nuevos: processedNuevos, activos: activos });
  } catch (error) {
    console.error('Error fetching user report:', error);
    res.status(500).json({ message: 'Error interno del servidor al generar reporte de usuarios.' });
  }
};

// 4. Reporte de Clases
export const getClassReport = async (_req: Request, res: Response) => {
  try {
    const report: ClassReportRawResult[] = await prisma.$queryRaw`
      SELECT 
          cg.nombre AS clase,
          CAST(COUNT(rc.id) AS SIGNED) AS reservas,
          CAST(SUM(CASE WHEN rc.asistio = TRUE THEN 1 ELSE 0 END) AS SIGNED) AS asistentes,
          CAST(ROUND(AVG(CASE WHEN rc.asistio = TRUE THEN 100.0 ELSE 0 END), 1) AS DECIMAL(3,1)) AS tasa_asistencia
      FROM clases_grupales cg
      JOIN reservas_clases rc ON cg.id = rc.clase_id
      WHERE rc.fecha_reserva >= CURDATE() - INTERVAL 30 DAY
      GROUP BY cg.id, cg.nombre
      ORDER BY tasa_asistencia DESC;
    `;

    console.log('Raw Class Report:', report); // Added logging

    const processedReport = report.map(item => ({
      clase: item.clase,
      reservas: Number(item.reservas),
      asistentes: Number(item.asistentes),
      tasa_asistencia: parseFloat(item.tasa_asistencia),
    }));

    res.json(processedReport);
  } catch (error) {
    console.error('Error fetching class report:', error); // Detailed error logging
    res.status(500).json({ message: 'Error interno del servidor al generar reporte de clases.' });
  }
};

// 5. Reporte de Equipos
export const getEquipmentReport = async (_req: Request, res: Response) => {
  try {
    const report: EquipmentReportRawResult[] = await prisma.$queryRaw`
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

    const processedReport = report.map(item => ({
      ...item,
      proxima_revision: item.proxima_revision ? item.proxima_revision.toISOString().split('T')[0] : null, // Format date
    }));

    res.json(processedReport);
  } catch (error) {
    console.error('Error fetching equipment report:', error); // Detailed error logging
    res.status(500).json({ message: 'Error interno del servidor al generar reporte de equipos.' });
  }
};

// 6. Reporte de Entrenamiento y Progreso
export const getTrainingReport = async (_req: Request, res: Response) => {
  try {
    const sessionsByTrainer: TrainingSessionByTrainerRawResult[] = await prisma.$queryRaw`
      SELECT 
          u.nombre_completo,
          CAST(COUNT(se.id) AS SIGNED) AS sesiones
      FROM sesiones_entrenamiento se
      JOIN usuarios u ON se.usuario_id = u.id
      WHERE se.creacion_fecha >= CURDATE() - INTERVAL 30 DAY
      GROUP BY u.id, u.nombre_completo
      ORDER BY sesiones DESC;
    `;
    console.log('Raw Training Sessions by Trainer Report:', sessionsByTrainer); // Added logging

    const evaluations: TrainingEvaluationRawResult[] = await prisma.$queryRaw`
      SELECT 
          DATE(fecha_evaluacion) AS dia,
          CAST(COUNT(*) AS SIGNED) AS evaluaciones
      FROM evaluaciones_fisicas
      WHERE fecha_evaluacion >= CURDATE() - INTERVAL 30 DAY
      GROUP BY DATE(fecha_evaluacion)
      ORDER BY dia;
    `;
    console.log('Raw Training Evaluations Report:', evaluations); // Added logging

    const processedSessionsByTrainer = sessionsByTrainer.map(item => ({
      nombre_completo: item.nombre_completo,
      sesiones: Number(item.sesiones),
    }));

    const processedEvaluations = evaluations.map(item => ({
      dia: item.dia.toISOString().split('T')[0], // Format date to YYYY-MM-DD
      evaluaciones: Number(item.evaluaciones),
    }));

    res.status(200).json({ sessionsByTrainer: processedSessionsByTrainer, evaluations: processedEvaluations });
  } catch (error) {
    console.error('Error fetching training report:', error); // Detailed error logging
    res.status(500).json({ message: 'Error interno del servidor al generar reporte de entrenamiento.' });
  }
};

// 7. Reporte de Actividad del Sistema
export const getSystemActivityReport = async (_req: Request, res: Response) => {
  try {
    const report: SystemActivityReportRawResult[] = await prisma.$queryRaw`
      SELECT 
          accion,
          CAST(COUNT(*) AS SIGNED) AS frecuencia
      FROM actividad_usuarios
      WHERE creacion_fecha >= CURDATE() - INTERVAL 7 DAY
      GROUP BY accion
      ORDER BY frecuencia DESC;
    `;

    const processedReport = report.map(item => ({
      accion: item.accion,
      frecuencia: Number(item.frecuencia),
    }));

    res.status(200).json(processedReport);
  } catch (error) {
    console.error('Error fetching system activity report:', error); // Detailed error logging
    res.status(500).json({ message: 'Error interno del servidor al generar reporte de actividad del sistema.' });
  }
};

// 8. Reporte Financiero Consolidado
export const getFinancialReport = async (_req: Request, res: Response) => {
  try {
    const [ingresosProductosRaw] = await prisma.$queryRaw<FinancialReportIncomeRawResult[]>`
      SELECT SUM(total_q) AS ingresos_productos
      FROM ordenes
      WHERE estado_orden = 'pagada'
        AND creacion_fecha >= '2025-04-01';
    `;

    const [ingresosSuscripcionesRaw] = await prisma.$queryRaw<FinancialReportIncomeRawResult[]>`
      SELECT SUM(p.precio_q) AS ingresos_suscripciones
      FROM suscripciones_usuario su
      JOIN planes_suscripcion p ON su.plan_id = p.id
            WHERE su.fecha_inicio >= '2025-04-01'
        AND su.estado_suscripcion IN ('activa', 'vencida');
    `;

    console.log('Raw Product Income:', ingresosProductosRaw); // Added logging
    console.log('Raw Subscription Income:', ingresosSuscripcionesRaw); // Added logging

    const ingresosProductos = parseFloat(ingresosProductosRaw?.ingresos_productos || '0');
    const ingresosSuscripciones = parseFloat(ingresosSuscripcionesRaw?.ingresos_suscripciones || '0');

    console.log('Processed Product Income:', ingresosProductos); // Added logging
    console.log('Processed Subscription Income:', ingresosSuscripciones); // Added logging

    res.status(200).json({
      ingresos_productos: ingresosProductos,
      ingresos_suscripciones: ingresosSuscripciones,
      total_ingresos: ingresosProductos + ingresosSuscripciones,
    });
  } catch (error) {
    console.error('Error fetching financial report:', error); // Detailed error logging
    res.status(500).json({ message: 'Error interno del servidor al generar reporte financiero.' });
  }
};