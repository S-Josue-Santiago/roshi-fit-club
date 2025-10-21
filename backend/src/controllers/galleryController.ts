// roshi_fit/backend/src/controllers/galleryController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

export const getActiveGalleryItems = async (_req: Request, res: Response) => {
  try {
    const items = await prisma.galeria.findMany({
      where: { estado: 'activo' },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        imagen_url: true,
      },
      orderBy: [{ orden_visual: 'asc' }, { creacion_fecha: 'desc' }],
      take: 10, // Máximo 10
    });

    res.status(200).json(items);
  } catch (error) {
    console.error('Error al obtener galería:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 1. LISTAR ITEMS DE GALERÍA
export const getGalleryItems = async (req: Request, res: Response) => {
  try {
    const { search, categoria, estado } = req.query;

    const where: any = {};

    if (categoria) where.categoria = String(categoria);
    if (estado) where.estado = String(estado);

    if (search && String(search).trim() !== '') {
      const term = String(search).trim();
      where.OR = [
        { titulo: { contains: term } },
        { descripcion: { not: null, contains: term } }
      ];
    }

    const items = await prisma.galeria.findMany({
      where,
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        categoria: true,
        imagen_url: true,
        estado: true,
      },
      orderBy: { orden_visual: 'asc' }
    });

    res.json(items);
  } catch (error) {
    console.error('Error al listar galería:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 2. OBTENER ITEM POR ID
export const getGalleryItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await prisma.galeria.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        categoria: true,
        imagen_url: true,
        orden_visual: true,
        estado: true,
      }
    });
    if (!item) return res.status(404).json({ message: 'Item no encontrado.' });
    res.json(item);
  } catch (error) {
    console.error('Error al obtener item:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 3. CREAR ITEM
export const createGalleryItem = async (req: Request, res: Response) => {
  try {
    const { titulo, descripcion, categoria, imagen_url, orden_visual } = req.body;

    if (!imagen_url) {
      return res.status(400).json({ message: 'La URL de la imagen es obligatoria.' });
    }

    const newItem = await prisma.galeria.create({
      data: {
        titulo,
        descripcion,
        categoria,
        imagen_url,
        orden_visual: orden_visual ? parseInt(orden_visual) : 0,
        estado: 'activo'
      },
      select: { id: true, titulo: true }
    });

    res.status(201).json({ message: 'Item creado.', item: newItem });
  } catch (error) {
    console.error('Error al crear item:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 4. ACTUALIZAR ITEM
export const updateGalleryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, categoria, imagen_url, orden_visual, estado } = req.body;

    const updated = await prisma.galeria.update({
      where: { id: parseInt(id) },
      data: {
        titulo,
        descripcion,
        categoria,
        imagen_url,
        orden_visual: orden_visual ? parseInt(orden_visual) : undefined,
        estado
      },
      select: { id: true, titulo: true, estado: true }
    });

    res.json({ message: 'Item actualizado.', item: updated });
  } catch (error) {
    console.error('Error al actualizar item:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 5. ACTIVAR/DESACTIVAR
export const toggleGalleryItemStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await prisma.galeria.findUnique({ where: { id: parseInt(id) } });
    if (!item) return res.status(404).json({ message: 'Item no encontrado.' });

    const newStatus = item.estado === 'activo' ? 'inactivo' : 'activo';
    const updated = await prisma.galeria.update({
      where: { id: parseInt(id) },
      data: { estado: newStatus }
    });

    res.json({ message: `Item ${newStatus}.`, item: updated });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};