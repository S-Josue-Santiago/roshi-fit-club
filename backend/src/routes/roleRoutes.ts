// roshi_fit/backend/src/routes/roleRoutes.ts
import { Router } from 'express';
import { getRoles } from '../controllers/roleController';

const router = Router();
router.get('/', getRoles); // GET /api/roles
export default router;