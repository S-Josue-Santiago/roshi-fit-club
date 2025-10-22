// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Inserta usuarios, planes, etc.
  await prisma.usuarios.create({
    data: {
      nombre_completo: 'Maestro Roshi Admin',
      email: 'admin@roshifit.com',
      password_hash: '$2b$10$AzX1q2f3g4h5j6k7l8m9n0p1r2s3t4u5v6w7x8y9z0', // password123
      tipo_usuario: 'admin',
      estado: 'activo',
    },
  });

  // Añade más datos según tu archivo `datos_db.txt`
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });