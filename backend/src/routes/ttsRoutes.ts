import { Router } from 'express';
import {
  generateTTS,
  generateBatchTTS
} from '@/controllers/ttsController';
import { rateLimiter } from '@/middleware/rateLimiter';

const router = Router();

// TTS generation
router.post('/generate', rateLimiter, generateTTS);
router.post('/generate-batch', rateLimiter, generateBatchTTS);

export default router;