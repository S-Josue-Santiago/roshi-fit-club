// roshi_fit/backend/src/routes/userRoutes.ts
import { Router } from 'express';
import { getUsers, registerUserWithPlan,   getUserById, 
  updateUser, 
  resetPassword, createUserFromAdmin, createUserWithSubscription, createStaffUser } from '../controllers/userController';

const router = Router();

router.get('/', getUsers);
router.post('/register-with-plan', registerUserWithPlan); // ← NUEVA RUTA

// CRUD por ID
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.post('/:id/reset-password', resetPassword);
// POST /api/users/admin-create
router.post('/admin-create', createUserFromAdmin); 
// POST /api/users/admin-create-with-subscription
router.post('/admin-create-with-subscription', createUserWithSubscription);
// POST /api/users/admin-create-staff
router.post('/admin-create-staff', createStaffUser);
export default router;

