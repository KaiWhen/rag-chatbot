import express from 'express';
import { indexStatusController } from '../controllers/index-status.controller';

const router = express.Router();

router.post('/', indexStatusController);

export default router;
