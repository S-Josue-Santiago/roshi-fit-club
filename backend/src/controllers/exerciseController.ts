// roshi_fit/backend/src/controllers/exerciseController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

// 1. LISTAR EJERCICIOS
export const getExercises = async (req: Request, res: Response) => {
  try {
    const { search, dificultad, tipo_musculo } = req.query;

    const where: any = {};

    if (dificultad) where.dificultad = String(dificultad);

    // ✅ Filtro case-insensitive para tipo_musculo
    if (tipo_musculo && String(tipo_musculo).trim() !== '') {
      const term = String(tipo_musculo).trim();
      where.tipo_musculo = { contains: term, mode: 'insensitive' };
    }

    // ✅ Búsqueda por nombre (sin mode: 'insensitive')
    if (search && String(search).trim() !== '') {
      const term = String(search).trim();
      where.nombre = { contains: term };
    }

    const exercises = await prisma.ejercicios.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        tipo_musculo: true,
        dificultad: true,
      },
      orderBy: { nombre: 'asc' }
    });

    res.json(exercises);
  } catch (error) {
    console.error('Error al listar ejercicios:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 2. OBTENER EJERCICIO POR ID
export const getExerciseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exercise = await prisma.ejercicios.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        tipo_musculo: true,
        dificultad: true,
        video_url: true,
        imagen: true,
      }
    });
    if (!exercise) return res.status(404).json({ message: 'Ejercicio no encontrado.' });
    res.json(exercise);
  } catch (error) {
    console.error('Error al obtener ejercicio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 3. CREAR EJERCICIO
export const createExercise = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, tipo_musculo, dificultad, video_url, imagen } = req.body;

    if (!nombre || !tipo_musculo || !dificultad) {
      return res.status(400).json({ message: 'Nombre, tipo de músculo y dificultad son obligatorios.' });
    }

    const newExercise = await prisma.ejercicios.create({
    data:   {
        nombre,
        descripcion,
        tipo_musculo,
        dificultad,
        video_url,
        imagen,
      },
      select: { id: true, nombre: true }
    });

    res.status(201).json({ message: 'Ejercicio creado.', exercise: newExercise });
  } catch (error) {
    console.error('Error al crear ejercicio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 4. ACTUALIZAR EJERCICIO
export const updateExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, tipo_musculo, dificultad, video_url, imagen } = req.body;

    const updated = await prisma.ejercicios.update({
      where: { id: parseInt(id) },
    data:   {
        nombre,
        descripcion,
        tipo_musculo,
        dificultad,
        video_url,
        imagen,
      },
      select: { id: true, nombre: true }
    });

    res.json({ message: 'Ejercicio actualizado.', exercise: updated });
  } catch (error) {
    console.error('Error al actualizar ejercicio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

//  Obtener tipos de músculo únicos
export const getMuscleTypes = async (_req: Request, res: Response) => {
  try {
    const types = await prisma.ejercicios.groupBy({
      by: ['tipo_musculo'],
      where: { tipo_musculo: { not: null } }
    });
    const muscleTypes = types.map(t => t.tipo_musculo).filter(Boolean) as string[];
    res.json(muscleTypes);
  } catch (error) {
    console.error('Error al obtener tipos de músculo:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};