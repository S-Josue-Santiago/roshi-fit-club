// roshi_fit/backend/src/routes/planRoutes.ts
import { Router } from 'express';
import { getActivePlans, getActivePlansForRegistration,   getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  togglePlanStatus
 } from '../controllers/planController';

const router = Router();
router.get('/active', getActivePlans);
router.get('/for-registration', getActivePlansForRegistration);
router.get('/', getAllPlans); // Changed from /with-active-users
router.get('/:id', getPlanById);
router.post('/', createPlan);
router.patch('/:id', updatePlan);
router.post('/:id/toggle-status', togglePlanStatus); // New route for toggling status


export default router;

