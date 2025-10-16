import { Router } from 'express';
import {
  generateMedia,
  generateBatchMedia
} from '@/controllers/mediaController';
import { rateLimiter } from '@/middleware/rateLimiter';

const router = Router();

// Media generation
router.post('/generate', rateLimiter, generateMedia);
router.post('/generate-batch', rateLimiter, generateBatchMedia);

export default router;