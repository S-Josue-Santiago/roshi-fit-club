// roshi_fit/backend/src/controllers/testimonialController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

export const getActiveTestimonials = async (_req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonios.findMany({
      where: {
        estado: 'activo',
        visible: true,
      },
      select: {
        id: true,
        testimonio: true,
        nombre_mostrar: true,
        avatar: true,
        rating: true,
        modificacion_fecha: true,
      },
      orderBy: [
        { modificacion_fecha: 'desc' },
        { rating: 'desc' },
      ],
      take: 15,
    });

    res.status(200).json(testimonials);
  } catch (error) {
    console.error('Error al obtener testimonios:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};