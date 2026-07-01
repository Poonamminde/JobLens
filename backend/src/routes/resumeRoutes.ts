import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createResume, downloadResume, getResume } from '../controllers/resumeController.js';

const router = Router();

router.use(protect);
router.get('/', getResume);
router.post('/', createResume);
router.get('/:id/download', downloadResume);

export default router;
