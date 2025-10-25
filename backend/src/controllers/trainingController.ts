// roshi_fit/backend/src/controllers/trainingController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

export const getMyTrainingPlan = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const plan = await prisma.planes_entrenamiento.findFirst({
      where: { 
        usuario_id: parseInt(userId),
        estado: 'activo'
      },
      include: {
        plan_ejercicios: {
          include: {
            ejercicios: {
              select: { nombre: true }
            }
          }
        }
      }
    });

    if (!plan) {
      return res.status(404).json({ message: 'No se encontró un plan de entrenamiento activo.' });
    }

    res.json(plan);
  } catch (error) {
    console.error('Error al obtener el plan de entrenamiento:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const updateExerciseStatus = async (req: Request, res: Response) => {
  try {
    const { exerciseId } = req.params;
    const { estado } = req.body;

    if (!['activo', 'desabilitado'].includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido.' });
    }

    const updated = await prisma.plan_ejercicios.update({
      where: { id: parseInt(exerciseId) },
      data: { estado }
    });

    res.json({ message: 'Estado actualizado.', exercise: updated });
  } catch (error) {
    console.error('Error al actualizar el estado del ejercicio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

