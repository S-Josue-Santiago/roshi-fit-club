// roshi_fit/backend/src/routes/productRoutes.ts
import { Router } from 'express';
import {getTopSellingProducts,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductStatus,
  updateProductStock
} from '../controllers/productController';

const router = Router();

router.get('/top-selling', getTopSellingProducts); // GET /api/products/top-selling

// admin


// Listar con filtros
router.get('/', getProducts);

// CRUD por ID
router.get('/:id', getProductById);
router.post('/', createProduct);
router.patch('/:id', updateProduct);
router.post('/:id/toggle-status', toggleProductStatus);
router.post('/:id/stock', updateProductStock);

export default router;