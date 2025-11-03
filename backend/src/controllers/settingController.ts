// roshi_fit/backend/src/controllers/settingController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

interface SettingItem { // Definir interfaz para los elementos de configuración
  clave: string;
  valor: string | null;
  descripcion: string | null;
}

// 1. Obtener todas las configuraciones
export const getAllSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.configuracion_sitio.findMany({
      where: { estado: 'activo' },
      select: { clave: true, valor: true, descripcion: true }
    });

    // Convertir a objeto para fácil acceso
    const settingsObj: Record<string, string> = {};
    settings.forEach((s: SettingItem) => {
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

// Nuevas funciones para manejar el contenido del sitio (sección 'contacto')
export const getSiteContent = async (_req: Request, res: Response) => {
  try {
    const siteContentRecord = await prisma.contenido_sitio.findFirst({
      where: { seccion: 'contacto' },
    });

    if (siteContentRecord && siteContentRecord.contenido) {
      const content = JSON.parse(siteContentRecord.contenido as string); // Contenido es JSON string
      res.status(200).json(content);
    } else {
      // Si no se encuentra, o el contenido es nulo, retornar un objeto vacío con valores por defecto
      const defaultContent = {
        ubicacion: '',
        telefono: '',
        correo: '',
        redes: {
          facebook: '',
          instagram: '',
          whatsapp: '',
        },
      };
      res.status(200).json(defaultContent);
    }
  } catch (error) {
    console.error('Error al obtener el contenido del sitio:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener el contenido del sitio.' });
  }
};

export const updateSiteContent = async (req: Request, res: Response) => {
  try {
    const newContent = req.body; // El frontend enviará el objeto JSON directamente

    // Validar que el cuerpo de la solicitud sea un objeto válido
    if (typeof newContent !== 'object' || newContent === null) {
      return res.status(400).json({ message: 'Formato de contenido inválido.' });
    }

    const contentString = JSON.stringify(newContent); // Convertir el objeto a string JSON

    await prisma.contenido_sitio.updateMany({
      where: { seccion: 'contacto' },
      data: { contenido: contentString },
    });

    res.status(200).json({ message: 'Contenido del sitio actualizado exitosamente.', updatedContent: newContent });
  } catch (error) {
    console.error('Error al actualizar el contenido del sitio:', error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar el contenido del sitio.' });
  }
};