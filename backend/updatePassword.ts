import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updatePassword() {
    const email = 'gohan@roshifit.com';
    const nuevaPassword = 'cliente1';

    try {
        // 1. Generar el hash correcto
        const hash = await bcrypt.hash(nuevaPassword, 10);
        console.log('🔐 Nuevo hash generado:', hash);

        // 2. Actualizar en la base de datos
        const usuario = await prisma.usuarios.update({
            where: { email },
            data: {
                hash_contrasena: hash,
                esta_activo: true,           // Asegurar que esté activo
                email_verificado: true,      // Asegurar que esté verificado
            }
        });

        console.log('✅ Contraseña actualizada exitosamente para:', usuario.email);
        console.log('📧 Email verificado:', usuario.email_verificado);
        console.log('✓ Usuario activo:', usuario.esta_activo);

        // 3. Verificar que funcione
        const esValida = await bcrypt.compare(nuevaPassword, hash);
        console.log('\n🧪 Verificación:', esValida ? '✅ CORRECTO' : '❌ ERROR');

    } catch (error) {
        console.error('❌ Error al actualizar:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updatePassword();