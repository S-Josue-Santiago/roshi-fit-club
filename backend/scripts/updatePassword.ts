// para ejecutar usar el comando npx ts-node scripts/updatePassword.ts y tener instalado npm install -D ts-node
// roshi_fit/backend/scripts/updatePassword.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updatePassword() {
  const email = 'carlos@roshifit.com';      // ← Cambia este email
  const nuevaPassword = 'password123';     // ← Cambia esta contraseña

  try {
    // 1. Generar hash con bcrypt (10 rondas)
    const hash = await bcrypt.hash(nuevaPassword, 10);
    console.log('🔐 Nuevo hash bcrypt generado:', hash);

    // 2. Actualizar en la base de datos
    const usuario = await prisma.usuarios.update({
      where: { email },
      data: {
        password_hash: hash,        // ← Nombre del campo en tu BD real
        estado: 'activo',           // ← Asegurar que esté activo
      },
    });

    console.log('✅ Contraseña actualizada para:', usuario.email);

    // 3. Verificar que el hash sea válido
    const esValida = await bcrypt.compare(nuevaPassword, hash);
    console.log('🧪 Verificación de hash:', esValida ? '✅ CORRECTO' : '❌ FALLÓ');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePassword();