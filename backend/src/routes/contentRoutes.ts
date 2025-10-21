// roshi_fit/backend/src/routes/contentRoutes.ts
import { Router } from 'express';
import { getContactContent } from '../controllers/contentController';

const router = Router();
router.get('/contact', getContactContent); // GET /api/content/contact
export default router;