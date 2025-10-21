// roshi_fit/backend/src/controllers/roleController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

export const getRoles = async (req: Request, res: Response) => {
  try {
    const { search, estado } = req.query;

    const where: any = {};

    // Filtro por estado
    if (estado) {
      where.estado = String(estado);
    }

    // Búsqueda segura (igual que en Usuarios)
    if (search && String(search).trim() !== '') {
      const term = String(search).trim();
      where.OR = [
        { nombre: { contains: term } }, // Sin mode: 'insensitive'
        // { descripcion: { not: null, contains: term } } // Solo si no es NULL
      ];
    }

    const roles = await prisma.roles.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        estado: true,
      },
      orderBy: { nombre: 'asc' }
    });

    res.json(roles);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};