// roshi_fit/backend/src/routes/uploadRoutes.ts
import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { uploadImage } from '../controllers/uploadController';
import { uploadEquipment } from '../middleware/uploadEquipmentMiddleware';

const router = Router();
router.post('/product-image', upload.single('image'), uploadImage);
router.post('/equipment-image', uploadEquipment.single('image'), uploadImage);
export default router;