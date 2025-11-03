// roshi_fit/backend/src/controllers/purchaseController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';

// 1. AGREGAR PRODUCTO AL CARRITO (solo usuarios registrados)
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { usuario_id, producto_id, cantidad } = req.body;

    // Validaciones
    if (!usuario_id || !producto_id || !cantidad) {
      return res.status(400).json({ message: 'Faltan datos: usuario_id, producto_id, cantidad.' });
    }

    const product = await prisma.productos.findUnique({
      where: { id: parseInt(producto_id) },
      select: { stock: true, estado: true }
    });

    if (!product || product.estado !== 'activo') {
      return res.status(404).json({ message: 'Producto no disponible.' });
    }

    if (product.stock === null || product.stock < parseInt(cantidad)) {
      return res.status(400).json({ message: 'Stock insuficiente.' });
    }

    // Verificar si ya está en el carrito
    const existing = await prisma.carrito_compras.findFirst({
      where: { usuario_id: parseInt(usuario_id), producto_id: parseInt(producto_id), estado: 'activo' }
    });

    if (existing) {
      // Actualizar cantidad
      await prisma.carrito_compras.update({
        where: { id: existing.id },
        data: { cantidad: parseInt(cantidad) }
      });
    } else {
      // Crear nuevo registro
      await prisma.carrito_compras.create({
        data: {
          usuario_id: parseInt(usuario_id),
          producto_id: parseInt(producto_id),
          cantidad: parseInt(cantidad),
          estado: 'activo'
        }
      });
    }

    res.status(201).json({ message: 'Producto agregado al carrito.' });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 2. OBTENER CARRITO DEL USUARIO
export const getCart = async (req: Request, res: Response) => {
  try {
    const { usuario_id } = req.params;

    const cartItems = await prisma.carrito_compras.findMany({
      where: { usuario_id: parseInt(usuario_id), estado: 'activo' },
      select: {
        id: true,
        cantidad: true,
        productos: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            precio_venta_q: true,
            imagen_principal: true,
            stock: true
          }
        }
      }
    });

    // Calcular total
    const total = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.productos.precio_venta_q.toString()) * item.cantidad);
    }, 0);

    res.json({ items: cartItems, total });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 3. CREAR ORDEN (checkout)
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      usuario_id,
      tipo_entrega,
      direccion_entrega,
      metodo_pago_id,
      detalles_pago
    } = req.body;

    if (!usuario_id || !metodo_pago_id) {
      return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }

    // Obtener carrito
    const cartItems = await prisma.carrito_compras.findMany({
      where: { usuario_id: parseInt(usuario_id), estado: 'activo' },
      include: { productos: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío.' });
    }

    // Calcular total
    const total = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.productos.precio_venta_q.toString()) * item.cantidad);
    }, 0);

    // Crear orden
    const orden = await prisma.ordenes.create({
     data:  {
        usuario_id: parseInt(usuario_id),
        total_q: total,
        estado_orden: 'pagada', // ← Por ahora, se marca como pagada
        tipo_entrega: tipo_entrega || 'retiro',
        direccion_entrega: direccion_entrega || null,
        metodo_pago_id: parseInt(metodo_pago_id),
        estado: 'activo'
      }
    });

    // Crear detalles de orden
    for (const item of cartItems) {
      await prisma.detalles_orden.create({
       data:  {
          orden_id: orden.id,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario_q: parseFloat(item.productos.precio_venta_q.toString()),
          subtotal_q: parseFloat(item.productos.precio_venta_q.toString()) * item.cantidad,
          estado: 'activo'
        }
      });

      // Actualizar stock
      await prisma.productos.update({ 
        where: { id: item.producto_id },
        data: { stock: { decrement: item.cantidad } }
      });
    }

    // Crear transacción
    await prisma.transacciones_pago.create({
    data:   {
        orden_id: orden.id,
        metodo_pago_id: parseInt(metodo_pago_id),
        monto_q: total,
        estado_transaccion: 'exitosa',
        detalles: detalles_pago || undefined,
        estado: 'activo'
      }
    });

    // Limpiar carrito
    await prisma.carrito_compras.deleteMany({
      where: { usuario_id: parseInt(usuario_id) }
    });

    // Generar factura
    const numeroFactura = `FAC-${new Date().getFullYear()}-${String(orden.id).padStart(4, '0')}`;
    await prisma.facturas.create({
     data:  {
        orden_id: orden.id,
        numero_factura: numeroFactura,
        fecha_emision: new Date(),
        total_q: total,
        tipo: 'venta',
        estado_factura: 'emitida',
        estado: 'activo'
      }
    });

    // Crear guía de envío (solo si es domicilio)
    if (tipo_entrega === 'domicilio' && direccion_entrega) {
      const numeroGuia = `GUA-${new Date().getFullYear()}-${String(orden.id).padStart(4, '0')}`;
      await prisma.guias_envio.create({
        data: {
          orden_id: orden.id,
          numero_guia: numeroGuia,
          empresa_envio: 'Guatex',
          estado_envio: 'preparando',
          fecha_estimada_entrega: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          tracking_url: `https://guatex.com/track/${numeroGuia}`,
          estado: 'activo'
        }
      });
    }

    res.status(201).json({ message: 'Compra realizada exitosamente.', orden_id: orden.id });
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 4. ACTUALIZAR CANTIDAD DE UN ÍTEM EN EL CARRITO
export const updateCartItemQuantity = async (req: Request, res: Response) => {
  try {
    const { usuario_id, item_id, cantidad } = req.body;

    if (!usuario_id || !item_id || cantidad === undefined || cantidad < 0) {
      return res.status(400).json({ message: 'Faltan datos o la cantidad es inválida.' });
    }

    const parsedUserId = parseInt(usuario_id);
    const parsedItemId = parseInt(item_id);
    const parsedCantidad = parseInt(cantidad);

    // 1. Buscar el ítem del carrito
    const cartItem = await prisma.carrito_compras.findFirst({
      where: { id: parsedItemId, usuario_id: parsedUserId, estado: 'activo' },
      include: { productos: true }
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Ítem del carrito no encontrado o no pertenece al usuario.' });
    }

    // 2. Si la cantidad es 0, eliminar el ítem
    if (parsedCantidad === 0) {
      await prisma.carrito_compras.delete({
        where: { id: parsedItemId }
      });
      return res.status(200).json({ message: 'Ítem eliminado del carrito.' });
    }

    // 3. Validar stock si la cantidad es mayor que 0
    if (cartItem.productos.stock === null || cartItem.productos.stock < parsedCantidad) {
      return res.status(400).json({ message: `Stock insuficiente para ${cartItem.productos.nombre}. Stock disponible: ${cartItem.productos.stock || 0}.` });
    }

    // 4. Actualizar la cantidad
    await prisma.carrito_compras.update({
      where: { id: parsedItemId },
      data: { cantidad: parsedCantidad }
    });

    res.status(200).json({ message: 'Cantidad del ítem actualizada exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar la cantidad del carrito:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 5. ELIMINAR UN ÍTEM DEL CARRITO
export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { usuario_id, item_id } = req.body; // DELETE requests can have body, but usually use params for IDs

    if (!usuario_id || !item_id) {
      return res.status(400).json({ message: 'Faltan datos: usuario_id, item_id.' });
    }

    const parsedUserId = parseInt(usuario_id);
    const parsedItemId = parseInt(item_id);

    // Eliminar el ítem del carrito, verificando que pertenezca al usuario
    const deleteResult = await prisma.carrito_compras.deleteMany({
      where: { id: parsedItemId, usuario_id: parsedUserId }
    });

    if (deleteResult.count === 0) {
      return res.status(404).json({ message: 'Ítem del carrito no encontrado o no pertenece al usuario.' });
    }

    res.status(200).json({ message: 'Ítem eliminado del carrito exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar ítem del carrito:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};