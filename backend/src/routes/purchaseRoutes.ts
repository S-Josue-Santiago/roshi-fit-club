// roshi_fit/backend/src/routes/purchaseRoutes.ts
import { Router } from 'express';
import { addToCart, getCart, createOrder } from '../controllers/purchaseController';

const router = Router();

// Carrito
router.post('/cart', addToCart);
router.get('/cart/:usuario_id', getCart);

// Checkout
router.post('/checkout', createOrder);

export default router;