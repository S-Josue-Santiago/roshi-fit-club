// // roshi_fit/backend/src/routes/categoryRoutes.ts
// import { Router } from 'express';
// import { getCategories } from '../controllers/categoryController';

// const router = Router();
// router.get('/', getCategories); // GET /api/categories
// export default router;


// roshi_fit/backend/src/routes/categoryRoutes.ts
import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  toggleCategoryStatus
} from '../controllers/categoryController';

const router = Router();
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.patch('/:id', updateCategory);
router.post('/:id/toggle-status', toggleCategoryStatus);
export default router;