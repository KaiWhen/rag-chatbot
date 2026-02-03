import { Router } from 'express';
import multer from 'multer';
import { handleUploadPdfController } from '../controllers/upload-pdf.controller.js';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('file'), handleUploadPdfController);

export default router;
