// roshi_fit/backend/src/routes/testimonialRoutes.ts
import { Router } from 'express';
import { getActiveTestimonials,
  getClientTestimonials, 
  createTestimonial, 
  updateTestimonial, 
  toggleTestimonialStatus // Importar la nueva función
} from '../controllers/testimonialController';

const router = Router();
router.get('/active', getActiveTestimonials); // GET /api/testimonials/active
// testimonios en clientes
router.get('/client/:userId', getClientTestimonials);
router.post('/', createTestimonial);
router.patch('/:id', updateTestimonial);
router.patch('/:id/toggle-status', toggleTestimonialStatus); // <-- ¡AQUÍ ESTÁ LA RUTA QUE FALTABA!

export default router;