// roshi_fit/backend/src/routes/supplierRoutes.ts
import { Router } from 'express';
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  toggleSupplierStatus
} from '../controllers/supplierController';

const router = Router();
router.get('/', getSuppliers);
router.get('/:id', getSupplierById);
router.post('/', createSupplier);
router.patch('/:id', updateSupplier);
router.post('/:id/toggle-status', toggleSupplierStatus);
export default router;