import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors'; // Importar cors
import serviceRoutes from './routes/serviceRoutes';
import planRoutes from './routes/planRoutes';
import scheduleRoutes from './routes/scheduleRoutes';
import productRoutes from './routes/productRoutes';
import equipmentRoutes from './routes/equipmentRoutes';
import galleryRoutes from './routes/galleryRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import contentRoutes from './routes/contentRoutes';
import authRoutes from './routes/authRoutes';
import paymentRoutes from './routes/paymentMethodRoutes';
import paymentMethodRoutes from './routes/paymentMethodRoutes';
import userRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoutes';
import categoryRoutes from './routes/categoryRoutes';
import uploadRoutes from './routes/uploadRoutes';
import supplierRoutes from './routes/supplierRoutes';
import exerciseRoutes from './routes/exerciseRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import salesRoutes from './routes/salesRoutes';
import reportRoutes from './routes/reportRoutes';
import settingRoutes from './routes/settingRoutes';





const app = express();

const corsOptions = {
    origin: [
    'http://localhost:5173',           // Desarrollo
     "https://roshi-fit-club.vercel.app/"  //'https://roshi-fit-club.vercel.app' // Producción
  ], // Reemplaza 5173 si usas otro puerto
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Permite cookies y encabezados de autorización
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
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
app.use('/api/payment', paymentRoutes);
// app.use('/api/plans', planRoutes);
app.use('/api/payment-methods', paymentMethodRoutes); // ← NUEVA LÍNEA
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


export const prisma = new PrismaClient();

// Rutas de API
app.get('/', (req, res) => {
  res.send('¡Servidor del gimnasio funcionando!');
});




export default app;