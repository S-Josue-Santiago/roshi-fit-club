// roshi_fit/backend/src/controllers/settingController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

// 1. Obtener todas las configuraciones
export const getAllSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.configuracion_sitio.findMany({
      where: { estado: 'activo' },
      select: { clave: true, valor: true, descripcion: true }
    });

    // Convertir a objeto para fácil acceso
    const settingsObj: Record<string, string> = {};
    settings.forEach(s => {
      settingsObj[s.clave] = s.valor || '';
    });

    res.json(settingsObj);
  } catch (error) {
    console.error('Error al obtener configuraciones:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 2. Actualizar configuración
export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { clave, valor } = req.body;

    if (!clave) {
      return res.status(400).json({ message: 'La clave es obligatoria.' });
    }

    // Buscar si existe
    const existing = await prisma.configuracion_sitio.findUnique({ where: { clave } });

    if (existing) {
      // Actualizar
      await prisma.configuracion_sitio.update({
        where: { clave },
        data: { valor }
      });
    } else {
      // Crear nuevo
      await prisma.configuracion_sitio.create({data:
         { clave, valor, estado: 'activo' }
      });
    }

    res.json({ message: 'Configuración actualizada.', clave, valor });
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};