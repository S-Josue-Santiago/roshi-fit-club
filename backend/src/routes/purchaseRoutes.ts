// roshi_fit/backend/src/routes/purchaseRoutes.ts
import { Router } from 'express';
import { addToCart, getCart, createOrder, updateCartItemQuantity, removeCartItem } from '../controllers/purchaseController';

const router = Router();

// Carrito
router.post('/cart', addToCart);
router.get('/cart/:usuario_id', getCart);
router.put('/cart/quantity', updateCartItemQuantity);
router.delete('/cart/item', removeCartItem);

// Checkout
router.post('/checkout', createOrder);

// Facturación
// router.get('/invoice/:orden_id', generateInvoicePdf);

export default router;