// roshi_fit/backend/src/controllers/userController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';
import * as bcrypt from 'bcryptjs';



export const registerUserWithPlan = async (req: Request, res: Response) => {
  const { 
    nombre_completo, 
    email, 
    contrasena, 
    plan_id,
    metodo_pago_id,
    detalles_pago // Objeto con datos específicos del método (ej: { numero_tarjeta, cvv, ... })
  } = req.body;

  try {
    // Validaciones
    if (!nombre_completo || !email || !contrasena || !plan_id || !metodo_pago_id) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    // Verificar email único
    const existingUser = await prisma.usuarios.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    // Verificar plan válido
    const plan = await prisma.planes_suscripcion.findUnique({
      where: { id: parseInt(plan_id), estado: 'activo' }
    });
    if (!plan) {
      return res.status(400).json({ message: 'Plan de suscripción inválido.' });
    }

    // Verificar método de pago válido
    const metodoPago = await prisma.metodos_pago.findUnique({
      where: { id: parseInt(metodo_pago_id), estado: 'activo' }
    });
    if (!metodoPago) {
      return res.status(400).json({ message: 'Método de pago inválido.' });
    }

    // Hashear contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // Crear usuario
    const newUser = await prisma.usuarios.create({
        data: { // ← FALTA "data:"
            nombre_completo,
            email,
            password_hash: hash,
            tipo_usuario: 'cliente',
            estado: 'activo',
            rol_id: 2,
        },
      select: { id: true, nombre_completo: true, email: true }
    });

    // Calcular fechas
    const fechaInicio = new Date();
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + plan.duracion_dias);

    // Crear suscripción
    await prisma.suscripciones_usuario.create({
      data: {
        usuario_id: newUser.id,
        plan_id: plan.id,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        estado_suscripcion: 'activa',
        estado: 'activo',
      }
    });

    // Crear transacción
    await prisma.transacciones_pago.create({
     data:  {
        metodo_pago_id: metodoPago.id,
        monto_q: plan.precio_q,
        estado_transaccion: 'exitosa', // En producción, esto dependería del gateway
        detalles: detalles_pago ? detalles_pago : undefined,
        estado: 'activo',
      }
    });

    return res.status(201).json({
      message: 'Registro y suscripción completados.',
      usuario: {
        id: newUser.id,
        nombre: newUser.nombre_completo,
        email: newUser.email,
        tipo: 'cliente',
        rol_id: 2,
      }
    });
  } catch (error) {
    console.error('Error en registro con plan:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};



// 1. LISTAR USUARIOS (con filtros)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { search, tipo_usuario, estado } = req.query;

    const where: any = {};

    if (tipo_usuario) where.tipo_usuario = String(tipo_usuario);
    if (estado) where.estado = String(estado);

    if (search && String(search).trim() !== '') {
      const term = String(search).trim();
      where.OR = [
        { nombre_completo: { contains: term } }, // ← Sin mode: 'insensitive'
        { email: { contains: term } }            // ← Confiamos en la collation de MySQL
      ];
    }

    const users = await prisma.usuarios.findMany({
      where,
      select: {
        id: true,
        nombre_completo: true,
        email: true,
        tipo_usuario: true,
        estado: true,
        creacion_fecha: true,
        rol_id: true,
      },
      orderBy: { creacion_fecha: 'desc' }
    });

    return res.status(200).json(users);
  } catch (error: any) {
    console.error('🔍 Error en getUsers:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};


// 2. OBTENER USUARIO POR ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.usuarios.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nombre_completo: true,
        email: true,
        tipo_usuario: true,
        estado: true,
        telefono: true,
        fecha_nacimiento: true,
        genero: true,
        creacion_fecha: true,
        // Puedes añadir más campos según necesites
      }
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
    res.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// 3. ACTUALIZAR USUARIO
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre_completo, email, tipo_usuario, estado } = req.body;

    // 🔄 Mapeo automático de tipo_usuario → rol_id
    const rolIdMap: Record<string, number> = {
      admin: 1,
      cliente: 2,
      entrenador: 3,
    };

    const rol_id = rolIdMap[tipo_usuario] || null; // null si no coincide

    const user = await prisma.usuarios.update({
      where: { id: parseInt(id) },
       data: {
        nombre_completo,
        email,
        tipo_usuario,
        rol_id,      // ← ¡Añadido!
        estado,
      }
    });

    res.json({ message: 'Usuario actualizado.', user });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
// 4. RESETEAR CONTRASEÑA (simulado)
// 4. RESETEAR CONTRASEÑA (CORREGIDO)
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body; // ← Recibe la nueva contraseña del cuerpo

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await prisma.usuarios.update({
      where: { id: parseInt(id) },
      data: { 
        password_hash: hash // ✅ CORREGIDO: usa el campo correcto de tu BD real
      }
    });

    res.json({ message: 'Contraseña restablecida exitosamente.' });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// NUEVA FUNCIÓN: Crear usuario desde el dashboard (admin)
export const createUserFromAdmin = async (req: Request, res: Response) => {
  const { 
    nombre_completo, 
    email, 
    contrasena, 
    tipo_usuario // 'admin', 'cliente', 'entrenador'
  } = req.body;

  try {
    // Validaciones
    if (!nombre_completo || !email || !contrasena || !tipo_usuario) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    // Verificar email único
    const existingUser = await prisma.usuarios.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    // Mapeo rol_id
    const rolIdMap: Record<string, number> = {
      admin: 1,
      cliente: 2,
      entrenador: 3,
    };
    const rol_id = rolIdMap[tipo_usuario] || 2; // cliente por defecto

    // Hashear contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // Crear usuario ACTIVO directamente
    const newUser = await prisma.usuarios.create({
      data: {
        nombre_completo,
        email,
        password_hash: hash,
        tipo_usuario,
        rol_id,
        estado: 'activo', // ← ¡Activo inmediatamente!
      },
      select: { id: true, nombre_completo: true, email: true, tipo_usuario: true }
    });

    return res.status(201).json({
      message: 'Usuario creado exitosamente.',
      usuario: newUser
    });
  } catch (error) {
    console.error('Error al crear usuario desde admin:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// NUEVA FUNCIÓN: Crear usuario cliente con suscripción y pago (admin)
export const createUserWithSubscription = async (req: Request, res: Response) => {
  const { 
    nombre_completo, 
    email, 
    contrasena,
    plan_id,
    metodo_pago_id,
    detalles_pago, // Ej: { numero_tarjeta, ... } o { metodo: "efectivo" }
  } = req.body;

  try {
    // Validaciones
    if (!nombre_completo || !email || !contrasena || !plan_id || !metodo_pago_id) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    // Verificar email único
    const existingUser = await prisma.usuarios.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    // Verificar plan
    const plan = await prisma.planes_suscripcion.findUnique({
      where: { id: parseInt(plan_id), estado: 'activo' }
    });
    if (!plan) {
      return res.status(400).json({ message: 'Plan inválido.' });
    }

    // Verificar método de pago
    const metodoPago = await prisma.metodos_pago.findUnique({
      where: { id: parseInt(metodo_pago_id), estado: 'activo' }
    });
    if (!metodoPago) {
      return res.status(400).json({ message: 'Método de pago inválido.' });
    }

    // Hashear contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // Crear usuario
    const newUser = await prisma.usuarios.create({
      data: {
        nombre_completo,
        email,
        password_hash: hash,
        tipo_usuario: 'cliente',
        rol_id: 2,
        estado: 'activo',
      },
      select: { id: true }
    });

    // Fechas de suscripción
    const fechaInicio = new Date();
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + plan.duracion_dias);

    // Crear suscripción
    await prisma.suscripciones_usuario.create({
      data: {
        usuario_id: newUser.id,
        plan_id: plan.id,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        estado_suscripcion: 'activa',
        estado: 'activo',
      }
    });

    // Crear transacción
    await prisma.transacciones_pago.create({
      data: {
        metodo_pago_id: metodoPago.id,
        monto_q: plan.precio_q,
        estado_transaccion: 'exitosa',
        detalles: detalles_pago || { metodo: 'efectivo' },
        estado: 'activo',
      }
    });

    return res.status(201).json({
      message: 'Usuario y suscripción creados exitosamente.',
      usuario: { id: newUser.id, email }
    });
  } catch (error) {
    console.error('Error al crear usuario con suscripción:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// NUEVA FUNCIÓN: Crear staff (admin/entrenador) sin suscripción
export const createStaffUser = async (req: Request, res: Response) => {
  const { nombre_completo, email, contrasena, tipo_usuario } = req.body;

  try {
    if (!['admin', 'entrenador'].includes(tipo_usuario)) {
      return res.status(400).json({ message: 'Tipo de usuario inválido para staff.' });
    }

    if (!nombre_completo || !email || !contrasena) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    const existingUser = await prisma.usuarios.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    const rolIdMap: Record<string, number> = { admin: 1, entrenador: 3 };
    const rol_id = rolIdMap[tipo_usuario];

    const hash = await bcrypt.hash(contrasena, 10);

    const newUser = await prisma.usuarios.create({
      data: {
        nombre_completo,
        email,
        password_hash: hash,
        tipo_usuario,
        rol_id,
        estado: 'activo',
      },
      select: { id: true, nombre_completo: true, email: true }
    });

    return res.status(201).json({
      message: 'Usuario staff creado exitosamente.',
      usuario: newUser
    });
  } catch (error) {
    console.error('Error al crear staff:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

//para la seccion de usuario

// roshi_fit/backend/src/controllers/userController.ts

// ACTUALIZAR PERFIL DEL USUARIO
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      nombre_completo, 
      telefono, 
      fecha_nacimiento, 
      genero, 
      direccion, 
      foto_perfil 
    } = req.body;

    const updatedUser = await prisma.usuarios.update({
      where: { id: parseInt(id) },
      data: {
        nombre_completo,
        telefono,
        fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : undefined,
        genero,
        direccion,
        foto_perfil,
      },
      select: {
        id: true,
        nombre_completo: true,
        email: true,
        telefono: true,
        fecha_nacimiento: true,
        genero: true,
        direccion: true,
        foto_perfil: true,
      }
    });

    res.json({ message: 'Perfil actualizado.', user: updatedUser });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// CAMBIAR CONTRASEÑA
export const changeUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.usuarios.findUnique({ where: { id: parseInt(id) } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Contraseña actual incorrecta.' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.usuarios.update({
      where: { id: parseInt(id) },
      data: { password_hash: hash }
    });

    res.json({ message: 'Contraseña actualizada.' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// NUEVA FUNCIÓN: Obtener perfil completo del usuario
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.usuarios.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nombre_completo: true,
        email: true,
        telefono: true,
        fecha_nacimiento: true,
        genero: true,
        direccion: true,
        foto_perfil: true,
        tipo_usuario: true,
      }
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
    res.json(user);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};