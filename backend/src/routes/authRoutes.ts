// roshi_fit/backend/src/routes/authRoutes.ts
import { Router } from 'express';
import { loginUser } from '../controllers/authController';

const router = Router();
router.post('/login', loginUser);
export default router;