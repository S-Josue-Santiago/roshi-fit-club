// roshi_fit/backend/src/controllers/equipmentController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

export const getActiveEquipment = async (_req: Request, res: Response) => {
  try {
    const equipment = await prisma.equipos.findMany({
      where: { estado: 'activo' },
      select: {
        id: true,
        nombre: true,
        tipo: true,
        marca: true,
        modelo: true,
        numero_serie: true,
        ubicacion: true,
        estado_equipo: true,
        ultima_revision: true,
        proxima_revision: true,
        imagen: true,
      },
      orderBy: { nombre: 'asc' },
    });

    res.status(200).json(equipment);
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};



// 1. LISTAR EQUIPOS
export const getEquipment = async (req: Request, res: Response) => {
  try {
    const { search, tipo, estado_equipo, estado } = req.query;

    const where: any = {};

    if (tipo) where.tipo = String(tipo);
    if (estado_equipo) where.estado_equipo = String(estado_equipo);
    if (estado) where.estado = String(estado);

    if (search && String(search).trim() !== '') {
      const term = String(search).trim();
      where.OR = [
        { nombre: { contains: term } },
        { marca: { contains: term } },
        { modelo: { contains: term } }
      ];
    }

    const equipment = await prisma.equipos.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        tipo: true,
        marca: true,
        modelo: true,
        numero_serie: true,
        ubicacion: true,
        estado_equipo: true,
        ultima_revision: true,
        proxima_revision: true,
        imagen: true,
        estado: true,
      },
      orderBy: { nombre: 'asc' }
    });

    res.json(equipment);
  } catch (error) {
    console.error('Error al listar equipos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 2. OBTENER EQUIPO POR ID
export const getEquipmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const equipment = await prisma.equipos.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nombre: true,
        tipo: true,
        marca: true,
        modelo: true,
        numero_serie: true,
        ubicacion: true,
        estado_equipo: true,
        ultima_revision: true,
        proxima_revision: true,
        imagen: true,
        estado: true,
      }
    });
    if (!equipment) return res.status(404).json({ message: 'Equipo no encontrado.' });
    res.json(equipment);
  } catch (error) {
    console.error('Error al obtener equipo:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 3. CREAR EQUIPO
export const createEquipment = async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      tipo,
      marca,
      modelo,
      numero_serie,
      ubicacion,
      estado_equipo,
      ultima_revision,
      proxima_revision,
      imagen
    } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre del equipo es obligatorio.' });
    }

    const newEquipment = await prisma.equipos.create({
      data: {
        nombre,
        tipo,
        marca,
        modelo,
        numero_serie,
        ubicacion,
        estado_equipo,
        ultima_revision: ultima_revision ? new Date(ultima_revision) : undefined,
        proxima_revision: proxima_revision ? new Date(proxima_revision) : undefined,
        imagen,
        estado: 'activo'
      },
      select: { id: true, nombre: true }
    });

    res.status(201).json({ message: 'Equipo creado.', equipment: newEquipment });
  } catch (error) {
    console.error('Error al crear equipo:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 4. ACTUALIZAR EQUIPO
export const updateEquipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      tipo,
      marca,
      modelo,
      numero_serie,
      ubicacion,
      estado_equipo,
      ultima_revision,
      proxima_revision,
      estado,
      imagen
    } = req.body;

    const updated = await prisma.equipos.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        tipo,
        marca,
        modelo,
        numero_serie,
        ubicacion,
        estado_equipo,
        ultima_revision: ultima_revision ? new Date(ultima_revision) : undefined,
        proxima_revision: proxima_revision ? new Date(proxima_revision) : undefined,
        estado,
        imagen
      },
      select: { id: true, nombre: true, estado: true }
    });

    res.json({ message: 'Equipo actualizado.', equipment: updated });
  } catch (error) {
    console.error('Error al actualizar equipo:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 5. ACTIVAR/DESACTIVAR
export const toggleEquipmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const equipment = await prisma.equipos.findUnique({ where: { id: parseInt(id) } });
    if (!equipment) return res.status(404).json({ message: 'Equipo no encontrado.' });

    const newStatus = equipment.estado === 'activo' ? 'inactivo' : 'activo';
    const updated = await prisma.equipos.update({
      where: { id: parseInt(id) },
     data:  { estado: newStatus }
    });

    res.json({ message: `Equipo ${newStatus}.`, equipment: updated });
  } catch (error) {
    console.error('Error al cambiar estado del equipo:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 6. OBTENER TIPOS ÚNICOS
export const getEquipmentTypes = async (_req: Request, res: Response) => {
  try {
    const types = await prisma.equipos.groupBy({
      by: ['tipo'],
      where: { tipo: { not: null } }
    });
    const uniqueTypes = types.map(t => t.tipo).filter(t => t !== null) as string[];
    res.json(uniqueTypes);
  } catch (error) {
    console.error('Error al obtener tipos de equipo:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};