// roshi_fit/backend/src/routes/reportRoutes.ts
import { Router } from 'express';
import { getSubscriptionReport, getProductReport, getUserReport, getClassReport, getTrainingReport, getEquipmentReport, getSystemActivityReport, getFinancialReport } from '../controllers/reportController';

const router = Router();

router.get('/subscriptions', getSubscriptionReport);
router.get('/products', getProductReport);
router.get('/users', getUserReport);
router.get('/classes', getClassReport);
router.get('/training', getTrainingReport);
router.get('/equipment', getEquipmentReport);
router.get('/system-activity', getSystemActivityReport);
router.get('/financial', getFinancialReport);

export default router;