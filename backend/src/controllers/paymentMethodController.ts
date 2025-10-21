// roshi_fit/backend/src/controllers/paymentMethodController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

// NUEVA FUNCIÓN: Obtener métodos de pago activos
export const getActivePaymentMethods = async (_req: Request, res: Response) => {
  try {
    const methods = await prisma.metodos_pago.findMany({
      where: { 
        estado: 'activo',
        activo_en_checkout: true,
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
      },
      orderBy: { id: 'asc' },
    });
    res.json(methods);
  } catch (error) {
    console.error('Error al obtener métodos de pago:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};