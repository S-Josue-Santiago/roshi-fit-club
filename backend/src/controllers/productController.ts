// roshi_fit/backend/src/controllers/productController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

export const getTopSellingProducts = async (_req: Request, res: Response) => {
  try {
    const topProducts = await prisma.$queryRaw`
      SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.sku,
        p.precio_venta_q,
        p.imagen_principal
      FROM productos p
      INNER JOIN detalles_orden do ON p.id = do.producto_id
      WHERE p.estado = 'activo'
      GROUP BY p.id, p.nombre, p.descripcion, p.sku, p.precio_venta_q, p.imagen_principal
      ORDER BY SUM(do.cantidad) DESC
      LIMIT 10;
    `;

    res.status(200).json(topProducts);
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// admin


// 1. LISTAR PRODUCTOS (con búsqueda y filtros)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, categoria_id, estado } = req.query;

    const where: any = {};

    // Filtros simples
    if (categoria_id) where.categoria_id = parseInt(categoria_id as string);
    if (estado) where.estado = String(estado);

    // Búsqueda segura (igual que en Usuarios y Roles)
    if (search && String(search).trim() !== '') {
      const term = String(search).trim();
      where.OR = [
        { nombre: { contains: term } },
        { descripcion: { not: null, contains: term } }
      ];
    }

    const products = await prisma.productos.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        categoria_id: true,
        sku: true,
        precio_venta_q: true,
        stock: true,
        imagen_principal: true,
        estado: true,
        categorias_producto: {
          select: { nombre: true }
        }
      },
      orderBy: { nombre: 'asc' }
    });

    res.json(products);
  } catch (error) {
    console.error('Error al listar productos:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 2. OBTENER PRODUCTO POR ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.productos.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        categoria_id: true,
        sku: true,
        precio_venta_q: true,
        stock: true,
        stock_minimo: true,
        imagen_principal: true,
        peso_kg: true,
        dimensiones_cm: true,
        estado: true,
        categorias_producto: {
          select: { nombre: true }
        }
      }
    });
    if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 3. CREAR PRODUCTO
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      descripcion,
      categoria_id,
      sku,
      precio_venta_q,
      stock,
      imagen_principal
    } = req.body;

    // Validaciones
    if (!nombre || !categoria_id || !precio_venta_q) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    // Verificar SKU único
    if (sku) {
      const existingSku = await prisma.productos.findUnique({ where: { sku } });
      if (existingSku) {
        return res.status(409).json({ message: 'El SKU ya está en uso.' });
      }
    }

    const newProduct = await prisma.productos.create({
      data: {
        nombre,
        descripcion,
        categoria_id: parseInt(categoria_id),
        sku,
        precio_venta_q: parseFloat(precio_venta_q),
        stock: stock ? parseInt(stock) : 0,
        imagen_principal,
        estado: 'activo'
      },
      select: {
        id: true,
        nombre: true,
        sku: true,
        precio_venta_q: true
      }
    });

    res.status(201).json({ message: 'Producto creado.', product: newProduct });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 4. ACTUALIZAR PRODUCTO
// roshi_fit/backend/src/controllers/productController.ts
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      categoria_id,
      sku,
      precio_venta_q,
      stock,
      estado,
      imagen_principal // ← Asegúrate de que esto esté aquí
    } = req.body;

    const updatedProduct = await prisma.productos.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        descripcion,
        categoria_id: categoria_id ? parseInt(categoria_id) : undefined,
        sku,
        precio_venta_q: precio_venta_q ? parseFloat(precio_venta_q) : undefined,
        stock: stock ? parseInt(stock) : undefined,
        estado,
        imagen_principal // ← ¡Esto es clave!
      },
      select: {
        id: true,
        nombre: true,
        sku: true,
        precio_venta_q: true,
        estado: true,
        imagen_principal: true // ← Para verificar en la respuesta
      }
    });

    res.json({ message: 'Producto actualizado.', product: updatedProduct });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 5. ACTIVAR/DESACTIVAR PRODUCTO
export const toggleProductStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.productos.findUnique({ where: { id: parseInt(id) } });
    if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });

    const newStatus = product.estado === 'activo' ? 'inactivo' : 'activo';
    const updated = await prisma.productos.update({
      where: { id: parseInt(id) },
      data: { estado: newStatus }
    });

    res.json({ message: `Producto ${newStatus}.`, product: updated });
  } catch (error) {
    console.error('Error al cambiar estado del producto:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// NUEVA FUNCIÓN: Actualizar stock de un producto
export const updateProductStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({ message: 'El stock debe ser un número entero mayor o igual a 0.' });
    }

    const updated = await prisma.productos.update({
      where: { id: parseInt(id) },
      data: { stock: parseInt(stock) },
      select: { id: true, nombre: true, stock: true }
    });

    res.json({ message: 'Stock actualizado.', product: updated });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};