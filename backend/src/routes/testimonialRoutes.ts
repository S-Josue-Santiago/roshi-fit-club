// roshi_fit/backend/src/routes/testimonialRoutes.ts
import { Router } from 'express';
import { getActiveTestimonials } from '../controllers/testimonialController';

const router = Router();
router.get('/active', getActiveTestimonials); // GET /api/testimonials/active
export default router;