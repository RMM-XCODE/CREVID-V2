import { Router } from 'express';
import contentRoutes from './contentRoutes';
import mediaRoutes from './mediaRoutes';
import ttsRoutes from './ttsRoutes';
import jobRoutes from './jobRoutes';
import settingsRoutes from './settingsRoutes';
import workerRoutes from './workerRoutes';

const router = Router();

// API Routes
router.use('/content', contentRoutes);
router.use('/media', mediaRoutes);
router.use('/tts', ttsRoutes);
router.use('/jobs', jobRoutes);
router.use('/settings', settingsRoutes);

// Worker Routes (for QStash callbacks)
router.use('/workers', workerRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'CREVID API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;