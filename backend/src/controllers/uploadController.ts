// roshi_fit/backend/src/controllers/uploadController.ts
import { Request, Response } from 'express';

// Extender Request para incluir `file`
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const uploadImage = (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se seleccionó ninguna imagen.' });
    }
    res.status(200).json({ filename: req.file.filename });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ message: 'Error al subir la imagen.' });
  }
};

// roshi_fit/backend/src/controllers/uploadController.ts

// SUBIR IMAGEN DE PERFIL
export const uploadProfileImage = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se seleccionó ninguna imagen.' });
    }
    res.status(200).json({ filename: req.file.filename });
  } catch (error) {
    console.error('Error al subir imagen de perfil:', error);
    res.status(500).json({ message: 'Error al subir la imagen.' });
  }
};