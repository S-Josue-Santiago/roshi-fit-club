// roshi_fit/backend/src/routes/paymentMethodRoutes.ts
import { Router } from 'express';
import { getActivePaymentMethods } from '../controllers/paymentMethodController';

const router = Router();
router.get('/active', getActivePaymentMethods); // GET /api/payment-methods/active
export default router;