// roshi_fit/backend/src/controllers/serviceController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

export const getTopServices = async (_req: Request, res: Response) => {
  try {
    const services = await prisma.servicios.findMany({
      where: { estado: 'activo' }, // ← Filtrar solo activos
      take: 5,
      select: {
        id: true,
        nombre: true,       
        descripcion: true,
        precio_q: true,      
        imagen: true,       
      },
      orderBy: { id: 'asc' },
    });

    res.status(200).json(services);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};



// 1. LISTAR SERVICIOS
export const getServices = async (req: Request, res: Response) => {
  try {
    const { search, estado } = req.query;

    const where: any = {};

    if (estado) where.estado = String(estado);

    if (search && String(search).trim() !== '') {
      const term = String(search).trim();
      where.OR = [
        { nombre: { contains: term } },
        { descripcion: { not: null, contains: term } }
      ];
    }

    const services = await prisma.servicios.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        duracion_minutos: true,
        precio_q: true,
        imagen: true,
        estado: true,
      },
      orderBy: { nombre: 'asc' }
    });

    res.json(services);
  } catch (error) {
    console.error('Error al listar servicios:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 2. OBTENER SERVICIO POR ID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await prisma.servicios.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        duracion_minutos: true,
        precio_q: true,
        imagen: true,
        estado: true,
      }
    });
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado.' });
    res.json(service);
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 3. CREAR SERVICIO
export const createService = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, duracion_minutos, precio_q, imagen } = req.body;

    if (!nombre || !precio_q) {
      return res.status(400).json({ message: 'Nombre, y precio son obligatorios.' });
    }

    const newService = await prisma.servicios.create({
      data: {
        nombre,
        descripcion,
        duracion_minutos: parseInt(duracion_minutos),
        precio_q: parseFloat(precio_q),
        imagen,
        estado: 'activo'
      },
      select: { id: true, nombre: true }
    });

    res.status(201).json({ message: 'Servicio creado.', service: newService });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 4. ACTUALIZAR SERVICIO
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, duracion_minutos, precio_q, imagen, estado } = req.body;

    const updated = await prisma.servicios.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        descripcion,
        duracion_minutos: duracion_minutos ? parseInt(duracion_minutos) : undefined,
        precio_q: precio_q ? parseFloat(precio_q) : undefined,
        imagen,
        estado
      },
      select: { id: true, nombre: true, estado: true }
    });

    res.json({ message: 'Servicio actualizado.', service: updated });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 5. ACTIVAR/DESACTIVAR
export const toggleServiceStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await prisma.servicios.findUnique({ where: { id: parseInt(id) } });
    if (!service) return res.status(404).json({ message: 'Servicio no encontrado.' });

    const newStatus = service.estado === 'activo' ? 'inactivo' : 'activo';
    const updated = await prisma.servicios.update({
      where: { id: parseInt(id) },
      data: { estado: newStatus }
    });

    res.json({ message: `Servicio ${newStatus}.`, service: updated });
  } catch (error) {
    console.error('Error al cambiar estado del servicio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};