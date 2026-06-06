import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getJobs, getStats, getJobById, createJob, updateJob, deleteJob } from '../controllers/jobController.js';

const router = Router();

// All routes protected
router.use(protect);

router.get('/stats', getStats);
router.get('/', getJobs);
router.post('/', createJob);
router.get('/:id', getJobById);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
