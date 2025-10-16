import { Router } from 'express';
import {
  getSettings,
  updateSettings,
  resetSettings,
  getSystemStatus
} from '@/controllers/settingsController';

const router = Router();

// Settings management
router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/reset', resetSettings);
router.get('/status', getSystemStatus);

export default router;