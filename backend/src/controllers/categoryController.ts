// roshi_fit/backend/src/controllers/categoryController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

// roshi_fit/backend/src/controllers/categoryController.ts
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { search, estado } = req.query;

    const where: any = {
      estado: 'activo' // ← Siempre activas (como la original)
    };

    if (estado && estado !== 'activo') {
      where.estado = String(estado); // Permite ver inactivas en el dashboard
    }

    if (search && String(search).trim() !== '') {
      const term = String(search).trim();
      where.OR = [
        { nombre: { contains: term } },
        { descripcion: { not: null, contains: term } }
      ];
    }

    const categories = await prisma.categorias_producto.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        estado: true,
      },
      orderBy: { nombre: 'asc' }
    });

    res.json(categories);
  } catch (error) {
    console.error('Error al listar categorías:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 2. OBTENER CATEGORÍA POR ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await prisma.categorias_producto.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        estado: true,
      }
    });
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada.' });
    res.json(category);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 3. CREAR CATEGORÍA
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es obligatorio.' });
    }

    const newCategory = await prisma.categorias_producto.create({
      data: {
        nombre,
        descripcion,
        estado: 'activo'
      },
      select: { id: true, nombre: true }
    });

    res.status(201).json({ message: 'Categoría creada.', category: newCategory });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 4. ACTUALIZAR CATEGORÍA
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;

    const updated = await prisma.categorias_producto.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        descripcion,
        estado
      },
      select: { id: true, nombre: true, estado: true }
    });

    res.json({ message: 'Categoría actualizada.', category: updated });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 5. ACTIVAR/DESACTIVAR
export const toggleCategoryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await prisma.categorias_producto.findUnique({ where: { id: parseInt(id) } });
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada.' });

    const newStatus = category.estado === 'activo' ? 'inactivo' : 'activo';
    const updated = await prisma.categorias_producto.update({
      where: { id: parseInt(id) },
    data:   { estado: newStatus }
    });

    res.json({ message: `Categoría ${newStatus}.`, category: updated });
  } catch (error) {
    console.error('Error al cambiar estado de categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};