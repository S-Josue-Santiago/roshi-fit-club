// roshi_fit/backend/src/controllers/scheduleController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

export const getGeneralSchedules = async (_req: Request, res: Response) => {
  try {
    const schedules = await prisma.horarios_servicio.findMany({
      where: {
        estado: 'activo',
        ubicacion: 'General', // ← Solo horarios en "General"
      },
      select: {
        dia_semana: true,
        hora_inicio: true,
        hora_fin: true,
      },
    });

    res.status(200).json(schedules);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};