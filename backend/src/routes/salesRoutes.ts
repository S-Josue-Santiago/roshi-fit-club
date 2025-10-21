// roshi_fit/backend/src/routes/salesRoutes.ts
import { Router } from 'express';
import { listSales, getSaleDetail, getSaleInvoice } from '../controllers/salesController';

const router = Router();
router.get('/', listSales);
router.get('/:id', getSaleDetail);
router.get('/:id/invoice', getSaleInvoice);

export default router;
