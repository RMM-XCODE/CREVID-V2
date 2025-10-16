import { Router } from 'express';
import {
  generateContent,
  saveContent,
  getContents,
  getContent,
  updateContent,
  deleteContent
} from '@/controllers/contentController';
import { rateLimiter } from '@/middleware/rateLimiter';

const router = Router();

// Content generation
router.post('/generate', rateLimiter, generateContent);

// Content CRUD operations
router.post('/', saveContent);
router.get('/', getContents);
router.get('/:id', getContent);
router.put('/:id', updateContent);
router.delete('/:id', deleteContent);

export default router;