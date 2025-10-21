// roshi_fit/backend/src/controllers/contentController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

export const getContactContent = async (_req: Request, res: Response) => {
  try {
    const content = await prisma.contenido_sitio.findUnique({
      where: { seccion: 'contacto' },
      select: {
        titulo: true,
        subtitulo: true,
        contenido: true,
      },
    });

    if (!content) {
      return res.status(404).json({ message: 'Contenido de contacto no encontrado.' });
    }

    res.status(200).json(content);
  } catch (error) {
    console.error('Error al obtener contenido de contacto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

