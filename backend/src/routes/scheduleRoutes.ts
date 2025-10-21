// roshi_fit/backend/src/routes/scheduleRoutes.ts
import { Router } from 'express';
import { getGeneralSchedules } from '../controllers/scheduleController';

const router = Router();
router.get('/general', getGeneralSchedules); // GET /api/schedules/general
export default router;