// roshi_fit/backend/src/controllers/supplierController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

// 1. LISTAR PROVEEDORES
export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const { search, estado } = req.query;

    const where: any = {};

    if (estado) where.estado = String(estado);

    if (search && String(search).trim() !== '') {
      const term = String(search).trim();
      where.OR = [
        { nombre_empresa: { contains: term } },
        { contacto_nombre: { contains: term } },
        { email: { contains: term } }
      ];
    }

    const suppliers = await prisma.proveedores.findMany({
      where,
      select: {
        id: true,
        nombre_empresa: true,
        contacto_nombre: true,
        email: true,
        telefono: true,
        estado: true,
      },
      orderBy: { nombre_empresa: 'asc' }
    });

    res.json(suppliers);
  } catch (error) {
    console.error('Error al listar proveedores:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 2. OBTENER PROVEEDOR POR ID
export const getSupplierById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supplier = await prisma.proveedores.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nombre_empresa: true,
        contacto_nombre: true,
        email: true,
        telefono: true,
        direccion: true,
        rfc_nit: true,
        estado: true,
      }
    });
    if (!supplier) return res.status(404).json({ message: 'Proveedor no encontrado.' });
    res.json(supplier);
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 3. CREAR PROVEEDOR
export const createSupplier = async (req: Request, res: Response) => {
  try {
    const { nombre_empresa, contacto_nombre, email, telefono, direccion, rfc_nit } = req.body;

    if (!nombre_empresa || !email) {
      return res.status(400).json({ message: 'Nombre de empresa y email son obligatorios.' });
    }

    const newSupplier = await prisma.proveedores.create({
    data:   {
        nombre_empresa,
        contacto_nombre,
        email,
        telefono,
        direccion,
        rfc_nit,
        estado: 'activo'
      },
      select: { id: true, nombre_empresa: true, email: true }
    });

    res.status(201).json({ message: 'Proveedor creado.', supplier: newSupplier });
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 4. ACTUALIZAR PROVEEDOR
export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre_empresa, contacto_nombre, email, telefono, direccion, rfc_nit, estado } = req.body;

    const updated = await prisma.proveedores.update({
      where: { id: parseInt(id) },
    data:   {
        nombre_empresa,
        contacto_nombre,
        email,
        telefono,
        direccion,
        rfc_nit,
        estado
      },
      select: { id: true, nombre_empresa: true, estado: true }
    });

    res.json({ message: 'Proveedor actualizado.', supplier: updated });
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 5. ACTIVAR/DESACTIVAR
export const toggleSupplierStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supplier = await prisma.proveedores.findUnique({ where: { id: parseInt(id) } });
    if (!supplier) return res.status(404).json({ message: 'Proveedor no encontrado.' });

    const newStatus = supplier.estado === 'activo' ? 'inactivo' : 'activo';
    const updated = await prisma.proveedores.update({
      where: { id: parseInt(id) },
    data:   { estado: newStatus }
    });

    res.json({ message: `Proveedor ${newStatus}.`, supplier: updated });
  } catch (error) {
    console.error('Error al cambiar estado del proveedor:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};