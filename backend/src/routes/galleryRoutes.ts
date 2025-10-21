// roshi_fit/backend/src/routes/galleryRoutes.ts
import { Router } from 'express';
import { getActiveGalleryItems,   getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  toggleGalleryItemStatus } from '../controllers/galleryController';

const router = Router();
router.get('/active', getActiveGalleryItems); // GET /api/gallery/active
router.get('/', getGalleryItems);
router.get('/:id', getGalleryItemById);
router.post('/', createGalleryItem);
router.patch('/:id', updateGalleryItem);
router.post('/:id/toggle-status', toggleGalleryItemStatus);
export default router;