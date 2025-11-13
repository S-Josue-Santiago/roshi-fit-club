// roshi_fit/backend/src/controllers/testimonialController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

export const getActiveTestimonials = async (_req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonios.findMany({
      where: {
        estado: 'activo',
        visible: true,
      },
      select: {
        id: true,
        testimonio: true,
        nombre_mostrar: true,
        avatar: true,
        rating: true,
        modificacion_fecha: true,
      },
      orderBy: [
        { modificacion_fecha: 'desc' },
        { rating: 'desc' },
      ],
      take: 15,
    });

    res.status(200).json(testimonials);
  } catch (error) {
    console.error('Error al obtener testimonios:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};



// Obtener testimonios del cliente (usuario_id)
export const getClientTestimonials = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const testimonials = await prisma.testimonios.findMany({
      where: { 
        usuario_id: parseInt(userId), 
        estado: { not: 'desabilitado' } 
      },
      select: {
        id: true,
        testimonio: true,
        rating: true,
        visible: true,
        estado: true,
        creacion_fecha: true,
        modificacion_fecha: true
      },
      orderBy: { creacion_fecha: 'desc' }
    });
    res.json(testimonials);
  } catch (error) {
    console.error('Error al obtener testimonios del cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Crear testimonio
export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { 
      usuario_id, 
      testimonio, 
      rating 
    } = req.body;

    if (!testimonio || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Testimonio y rating (1-5) son obligatorios.' });
    }

    const newTestimonial = await prisma.testimonios.create({
      data: {
        usuario_id: parseInt(usuario_id),
        testimonio,
        rating: parseInt(rating),
        estado: 'activo',
        visible: true
      },
      select: {
        id: true,
        testimonio: true,
        rating: true,
        estado: true
      }
    });

    res.status(201).json({ message: 'Testimonio creado.', testimonial: newTestimonial });
  } catch (error) {
    console.error('Error al crear testimonio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Actualizar testimonio (solo testimonio y rating)
export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { testimonio, rating } = req.body;

    if (!testimonio || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Testimonio y rating (1-5) son obligatorios.' });
    }

    const updated = await prisma.testimonios.update({
      where: { id: parseInt(id) },
      data: { 
        testimonio, 
        rating: parseInt(rating) 
      },
      select: {
        id: true,
        testimonio: true,
        rating: true
      }
    });

    res.json({ message: 'Testimonio actualizado.', testimonial: updated });
  } catch (error) {
    console.error('Error al actualizar testimonio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Inactivar testimonio
export const deactivateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await prisma.testimonios.update({
      where: { id: parseInt(id) },
      data: { estado: 'inactivo' }
    });
    res.json({ message: 'Testimonio desactivado.', testimonial: updated });
  } catch (error) {
    console.error('Error al desactivar testimonio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Alternar estado de un testimonio (activo/inactivo)
export const toggleTestimonialStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const testimonial = await prisma.testimonios.findUnique({
      where: { id: parseInt(id) },
      select: { estado: true }
    });

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonio no encontrado.' });
    }

    const newStatus = testimonial.estado === 'activo' ? 'inactivo' : 'activo';

    const updatedTestimonial = await prisma.testimonios.update({
      where: { id: parseInt(id) },
      data: { estado: newStatus }
    });

    res.json({ message: `Testimonio ahora está ${newStatus}.`, testimonial: updatedTestimonial });
  } catch (error) {
    console.error('Error al alternar el estado del testimonio:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};