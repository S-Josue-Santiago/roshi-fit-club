// roshi_fit/backend/src/routes/equipmentRoutes.ts
import { Router } from 'express';
import { getActiveEquipment,   getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  toggleEquipmentStatus,
  getEquipmentTypes} from '../controllers/equipmentController';

const router = Router();
router.get('/active', getActiveEquipment); // GET /api/equipment/active

// Admin
// roshi_fit/backend/src/routes/equipmentRoutes.ts
router.get('/', getEquipment);
router.get('/types', getEquipmentTypes);
router.get('/:id', getEquipmentById);
router.post('/', createEquipment);
router.patch('/:id', updateEquipment);
router.post('/:id/toggle-status', toggleEquipmentStatus);
export default router;