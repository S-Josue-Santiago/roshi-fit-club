// roshi_fit/backend/src/routes/settingRoutes.ts
import { Router } from 'express';
import { getAllSettings, updateSetting } from '../controllers/settingController';

const router = Router();
router.get('/', getAllSettings);
router.post('/update', updateSetting);
export default router;