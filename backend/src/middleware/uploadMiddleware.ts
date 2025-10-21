// roshi_fit/backend/src/middleware/uploadMiddleware.ts
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

const productsDir = path.join(__dirname, '../../../public/assets/products');
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `product_${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes'));
  }
};

export const upload = multer({ storage, fileFilter });