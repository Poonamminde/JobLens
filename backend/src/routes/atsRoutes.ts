import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { analyzeResume, resumeUpload } from '../controllers/atsController.js';

const router = Router();

router.use(protect);

router.post('/analyze', resumeUpload.single('resume'), analyzeResume);

export default router;
