import { Router } from "express";
import multer from "multer";
import { handleUploadPdfController } from "../controllers/upload-pdf.controller";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-pdf", upload.single("pdf"), handleUploadPdfController);

export default router;
