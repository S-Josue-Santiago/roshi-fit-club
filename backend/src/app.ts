import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import cors from 'cors'; // Importar cors
import serviceRoutes from './routes/serviceRoutes.js';
import planRoutes from './routes/planRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import productRoutes from './routes/productRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import paymentMethodRoutes from './routes/paymentMethodRoutes.js';
import userRoutes from './routes/userRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';
import trainingRoutes from './routes/trainingRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
    origin: [
    'https://roshi-fit-club-1.onrender.com',
    'http://localhost:5173',           // Para desarrollo local
    'https://roshi-gym.vercel.app'     // Tu URL de producción en Vercel
  ], // Reemplaza 5173 si usas otro puerto
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'], // ← Array en lugar de string
  credentials: true, // Permite cookies y encabezados de autorización
    allowedHeaders: ['Content-Type', 'Authorization'], // ← AGREGAR ESTO

  optionsSuccessStatus: 204

};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ← AGREGAR: Maneja preflight

app.use(express.json());
app.use('/api/services', serviceRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/products', productRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/users', userRoutes);
//apis para la seccion de roles
app.use('/api/roles', roleRoutes);
// apis para productos
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
// para proveedores
app.use('/api/suppliers', supplierRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/sales', salesRoutes);

//para reportes
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/training', trainingRoutes);

// Servir archivos estáticos de la aplicación frontend
app.use(express.static(path.join(__dirname, '../../dist')));

// Para cualquier otra ruta que no sea de API, servir el index.html de la aplicación frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
});

export const prisma = new PrismaClient();
export { Prisma };

// Rutas de API
app.get('/', (req, res) => {
  res.send('¡Servidor del gimnasio funcionando!');
});


export default app;