// roshi_fit/backend/src/routes/testimonialRoutes.ts
import { Router } from 'express';
import { getActiveTestimonials,   getClientTestimonials, 
  createTestimonial, 
  updateTestimonial, 
  deactivateTestimonial  } from '../controllers/testimonialController';

const router = Router();
router.get('/active', getActiveTestimonials); // GET /api/testimonials/active
// testimonios en clientes
router.get('/client/:userId', getClientTestimonials);
router.post('/', createTestimonial);
router.patch('/:id', updateTestimonial);
router.post('/:id/deactivate', deactivateTestimonial);
export default router;