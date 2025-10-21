// roshi_fit/backend/src/routes/planRoutes.ts
import { Router } from 'express';
import { getActivePlans, getActivePlansForRegistration,   getPlansWithActiveUsers,
  getPlanById,
  createPlan,
  updatePlan } from '../controllers/planController';


const router = Router();
router.get('/active', getActivePlans);
router.get('/for-registration', getActivePlansForRegistration);
router.get('/with-active-users', getPlansWithActiveUsers);
router.get('/:id', getPlanById);
router.post('/', createPlan);
router.patch('/:id', updatePlan);
export default router;

