// roshi_fit/backend/src/routes/trainingRoutes.ts
import { Router } from 'express';
import { getMyTrainingPlan, updateExerciseStatus } from '../controllers/trainingController';

const router = Router();
router.get('/:userId', getMyTrainingPlan);
router.patch('/exercises/:exerciseId/status', updateExerciseStatus);
export default router;

