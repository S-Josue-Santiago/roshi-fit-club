// roshi_fit/backend/src/routes/serviceRoutes.ts
import { Router } from 'express';
import { getTopServices, getServices,
  getServiceById,
  createService,
  updateService,
  toggleServiceStatus } from '../controllers/serviceController';

const router = Router();
router.get('/top', getTopServices); // GET /api/services/top
router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', createService);
router.patch('/:id', updateService);
router.post('/:id/toggle-status', toggleServiceStatus);
export default router;