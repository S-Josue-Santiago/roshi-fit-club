// roshi_fit/backend/src/controllers/authController.ts
import { Request, Response } from 'express';
import { prisma } from '../app';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Validar campos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }

    // 2. Buscar usuario
    const user = await prisma.usuarios.findUnique({ where: { email } });
    if (!user || user.estado !== 'activo') {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // 3. Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // 4. Generar JWT
    const token = jwt.sign(
      { id: user.id, tipo: user.tipo_usuario },
      process.env.JWT_SECRET || 'roshi_secret_key',
      { expiresIn: '1d' }
    );

    // 5. Responder con token y datos básicos
    return res.status(200).json({
      status: 'success',
      message: 'Inicio de sesión exitoso.',
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre_completo,
        email: user.email,
        tipo: user.tipo_usuario, // 'admin' | 'cliente' | 'entrenador'
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};