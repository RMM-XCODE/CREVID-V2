import { Router } from 'express';
import {
  getJob,
  getJobsByContent,
  getAllJobs,
  cancelJob,
  retryJob
} from '@/controllers/jobsController';

const router = Router();

// Job management
router.get('/', getAllJobs);
router.get('/:job_id', getJob);
router.get('/content/:content_id', getJobsByContent);
router.post('/:job_id/cancel', cancelJob);
router.post('/:job_id/retry', retryJob);

export default router;