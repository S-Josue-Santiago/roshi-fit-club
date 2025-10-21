// roshi_fit/backend/src/routes/subscriptionRoutes.ts
import { Router } from 'express';
import {
  getLatestSubscriptionsPerUser,
  extendSubscription,
  cancelSubscription,
  renewSubscription,
  getUserSubscriptionHistory,
} from '../controllers/subscriptionController';

const router = Router();

// Tabla principal con filtros
router.get('/', getLatestSubscriptionsPerUser);

// Acciones
router.patch('/:id/extend', extendSubscription);
router.patch('/:id/cancel', cancelSubscription);
router.post('/renew', renewSubscription);

// Historial por usuario
router.get('/:userId/history', getUserSubscriptionHistory);

export default router;
