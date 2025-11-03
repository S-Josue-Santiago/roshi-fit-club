// roshi_fit/backend/src/routes/settingRoutes.ts
import { Router } from 'express';
import { getAllSettings, updateSetting, getSiteContent, updateSiteContent } from '../controllers/settingController';

const router = Router();
router.get('/', getAllSettings);
router.post('/update', updateSetting);

router.get('/site-content', getSiteContent);
router.put('/site-content', updateSiteContent);

export default router;