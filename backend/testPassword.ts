import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testPassword() {
    const email = 'gohan@roshifit.com';
    const passwordIngresada = 'cliente1';

    try {
        // 1. Buscar el usuario en la base de datos
        const usuario = await prisma.usuarios.findUnique({
            where: { email }
        });

        if (!usuario) {
            console.log('❌ Usuario no encontrado');
            return;
        }

        console.log('✅ Usuario encontrado:', {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre_completo,
            esta_activo: usuario.esta_activo,
            email_verificado: usuario.email_verificado,
            tipo_usuario: usuario.tipo_usuario
        });

        console.log('\n📝 Hash almacenado en DB:', usuario.hash_contrasena);

        // 2. Comparar la contraseña
        const esValida = await bcrypt.compare(passwordIngresada, usuario.hash_contrasena);
        
        console.log('\n🔐 Contraseña ingresada:', passwordIngresada);
        console.log('✅ ¿Contraseña válida?:', esValida);

        // 3. Verificar condiciones de acceso
        if (!usuario.esta_activo) {
            console.log('❌ Cuenta NO ACTIVA');
        }
        if (!usuario.email_verificado) {
            console.log('❌ Email NO VERIFICADO');
        }
        if (usuario.tipo_usuario === null) {
            console.log('❌ Tipo de usuario es NULL');
        }

        // 4. Si la contraseña no es válida, crear un nuevo hash
        if (!esValida) {
            console.log('\n🔧 Generando nuevo hash para la contraseña...');
            const nuevoHash = await bcrypt.hash(passwordIngresada, 10);
            console.log('Nuevo hash:', nuevoHash);
            
            console.log('\n💡 Ejecuta este query en Prisma Studio o tu DB:');
            console.log(`UPDATE usuarios SET hash_contrasena = '${nuevoHash}' WHERE email = '${email}';`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testPassword();