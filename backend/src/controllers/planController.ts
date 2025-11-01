// roshi_fit/backend/src/controllers/planController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

export const getActivePlans = async (_req: Request, res: Response) => {
  try {
    const plans = await prisma.planes_suscripcion.findMany({
      where: { estado: 'activo' },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        precio_q: true,
        beneficios: true,
        imagen: true,
      },
      orderBy: { precio_q: 'asc' }, // Más barato primero
    });

    res.status(200).json(plans);
  } catch (error) {
    console.error('Error al obtener planes:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const getActivePlansForRegistration = async (_req: Request, res: Response) => {
  try {
    const plans = await prisma.planes_suscripcion.findMany({
      where: { estado: 'activo' },
      select: {
        id: true,
        nombre: true,
        precio_q: true,
      },
      orderBy: { precio_q: 'asc' },
    });
    res.json(plans);
  } catch (error) {
    console.error('Error al obtener planes para registro:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

//administrador

// 1. LISTAR PLANES CON CONTEO DE USUARIOS ACTIVOS
export const getAllPlans = async (_req: Request, res: Response) => {
  try {
    const { search, estado } = _req.query;

    const where: any = {};
    if (search && String(search).trim() !== '') {
      const term = String(search).trim();
      where.OR = [
        { nombre: { contains: term, mode: 'insensitive' } },
        { descripcion: { not: null, contains: term, mode: 'insensitive' } }
      ];
    }

    if (estado && String(estado).trim() !== '') {
      where.estado = String(estado).trim();
    }

    // Obtener planes con conteo de usuarios activos
    const plans = await prisma.planes_suscripcion.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        precio_q: true,
        duracion_dias: true,
        imagen: true,
        estado: true, // Include estado in the selection
      },
      orderBy: { nombre: 'asc' }
    });

    // Para cada plan, contar usuarios activos
    const plansWithCount = await Promise.all(
      plans.map(async (plan) => {
        const count = await prisma.suscripciones_usuario.count({
          where: {
            plan_id: plan.id,
            estado_suscripcion: 'activa',
            estado: 'activo'
          }
        });
        return { ...plan, usuarios_activos: count };
      })
    );

    res.json(plansWithCount);
  } catch (error) {
    console.error('Error al listar planes:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 2. OBTENER PLAN POR ID
export const getPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plan = await prisma.planes_suscripcion.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        precio_q: true,
        duracion_dias: true,
        imagen: true,
        beneficios: true,
      }
    });
    if (!plan) return res.status(404).json({ message: 'Plan no encontrado.' });
    res.json(plan);
  } catch (error) {
    console.error('Error al obtener plan:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 3. CREAR PLAN
export const createPlan = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, precio_q, duracion_dias, imagen, beneficios } = req.body;

    if (!nombre || !precio_q || !duracion_dias) {
      return res.status(400).json({ message: 'Nombre, precio y duración son obligatorios.' });
    }

    const newPlan = await prisma.planes_suscripcion.create({
      data: {
        nombre,
        descripcion,
        precio_q: parseFloat(precio_q),
        duracion_dias: parseInt(duracion_dias),
        imagen,
        beneficios: beneficios ? JSON.parse(beneficios) : undefined,
        estado: 'activo'
      },
      select: { id: true, nombre: true }
    });

    res.status(201).json({ message: 'Plan creado.', plan: newPlan });
  } catch (error) {
    console.error('Error al crear plan:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 4. ACTUALIZAR PLAN
export const updatePlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio_q, duracion_dias, imagen, beneficios } = req.body;

    const updated = await prisma.planes_suscripcion.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        descripcion,
        precio_q: precio_q ? parseFloat(precio_q) : undefined,
        duracion_dias: duracion_dias ? parseInt(duracion_dias) : undefined,
        imagen,
        beneficios: beneficios ? JSON.parse(beneficios) : undefined,
      },
      select: { id: true, nombre: true }
    });

    res.json({ message: 'Plan actualizado.', plan: updated });
  } catch (error) {
    console.error('Error al actualizar plan:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 5. TOGGLE PLAN STATUS
export const togglePlanStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const planId = parseInt(id);

    const existingPlan = await prisma.planes_suscripcion.findUnique({
      where: { id: planId },
    });

    if (!existingPlan) {
      return res.status(404).json({ message: 'Plan no encontrado.' });
    }

    const newStatus = existingPlan.estado === 'activo' ? 'inactivo' : 'activo';

    const updatedPlan = await prisma.planes_suscripcion.update({
      where: { id: planId },
      data: { estado: newStatus },
      select: { id: true, nombre: true, estado: true },
    });

    res.json({ message: `Plan ${updatedPlan.nombre} ahora está ${updatedPlan.estado}.`, plan: updatedPlan });
  } catch (error) {
    console.error('Error al cambiar estado del plan:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};