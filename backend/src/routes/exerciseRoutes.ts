// roshi_fit/backend/src/routes/exerciseRoutes.ts
import { Router } from 'express';
import {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  getMuscleTypes
} from '../controllers/exerciseController';

const router = Router();
router.get('/', getExercises);
router.get('/muscle-types', getMuscleTypes);
router.get('/:id', getExerciseById);
router.post('/', createExercise);
router.patch('/:id', updateExercise);
export default router;