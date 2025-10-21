// roshi_fit/backend/src/routes/reportRoutes.ts
import { Router } from 'express';
import {
  getSubscriptionReport,
  getProductReport,
  getUserReport,
  getClassReport,
  getEquipmentReport
} from '../controllers/reportController';

const router = Router();
router.get('/subscriptions', getSubscriptionReport);
router.get('/products', getProductReport);
router.get('/users', getUserReport);
router.get('/classes', getClassReport);
router.get('/equipment', getEquipmentReport);
export default router;